import { NextResponse } from "next/server";
import { createAuthenticatedRouteHandlerClient } from "@/lib/supabase-server";
import { requireUser } from "@/lib/auth";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 4;

export async function POST(request: Request) {
  const supabase = createAuthenticatedRouteHandlerClient();

  try {
    const user = await requireUser();

    const { data: dbUser } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (dbUser?.role !== "customer") {
      return NextResponse.json(
        { success: false, error: "Only customers can upload booking photos" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("photos").filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ success: true, data: { urls: [] } });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `You can upload up to ${MAX_FILES} photos` },
        { status: 400 }
      );
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "worker-documents";
    const urls: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { success: false, error: "Each photo must be under 5MB" },
          { status: 400 }
        );
      }

      const filePath = `booking-photos/${user.id}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

      if (uploadError) {
        return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
      }

      const { data: signedUrlData } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60 * 60 * 24 * 365);

      if (signedUrlData?.signedUrl) {
        urls.push(signedUrlData.signedUrl);
      }
    }

    return NextResponse.json({ success: true, data: { urls } });
  } catch {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
