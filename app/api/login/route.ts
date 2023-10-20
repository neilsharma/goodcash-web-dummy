import { TOKEN_KEY } from "@/app/constants";
import { cookies, headers } from "next/headers";

export async function POST() {
  const headersStore = headers();
  const cookieStore = cookies();

  const token = headersStore.get(TOKEN_KEY)!;
  cookieStore.set(TOKEN_KEY, token, { httpOnly: true });

  return new Response("OK");
}
