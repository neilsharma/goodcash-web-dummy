import { TOKEN_KEY } from "@/app/constants";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete(TOKEN_KEY);

  return new Response("OK");
}
