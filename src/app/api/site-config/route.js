import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";

// Public endpoint — safe values only. Used by the /admin/login page to know
// whether to render the Google sign-in button.
export async function GET() {
  try {
    const content = await getContent();
    const enabled = !!content?.settings?.googleSignInEnabled;
    return NextResponse.json({
      googleSignInEnabled: enabled,
      googleClientId: enabled ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "" : "",
    });
  } catch {
    return NextResponse.json({ googleSignInEnabled: false, googleClientId: "" });
  }
}
