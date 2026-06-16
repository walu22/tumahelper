const base64url = "W3siYWNjZXNzX3Rva2VuIjoidGVzdCJ9XQ";
try {
  const decodedBase64 = Buffer.from(base64url, "base64url").toString("utf8");
  console.log("Decoded:", decodedBase64);
  console.log("Parsed:", JSON.parse(decodedBase64));
} catch (e) {
  console.error("Error:", e);
}
