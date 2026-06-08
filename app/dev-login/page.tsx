import Link from "next/link"

export default function DevLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Dev Login</h1>
        <p className="text-sm text-muted-foreground mb-4">Click a user to log in instantly:</p>
        <div className="space-y-2">
          <Link href="/api/auth/dev-login?phone=%2B260961111111" className="block p-3 border rounded-lg hover:bg-gray-50">
            <span className="font-medium">Worker</span>
            <span className="text-xs text-muted-foreground ml-2">+260961111111</span>
          </Link>
          <Link href="/api/auth/dev-login?phone=%2B260976666666" className="block p-3 border rounded-lg hover:bg-gray-50">
            <span className="font-medium">Customer</span>
            <span className="text-xs text-muted-foreground ml-2">+260976666666</span>
          </Link>
          <Link href="/api/auth/dev-login?phone=%2B260970000001" className="block p-3 border rounded-lg hover:bg-gray-50">
            <span className="font-medium">Admin</span>
            <span className="text-xs text-muted-foreground ml-2">+260970000001</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
