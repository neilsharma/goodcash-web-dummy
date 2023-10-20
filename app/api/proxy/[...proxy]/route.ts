import appRouterServerSideHttpClient from "@/shared/http/clients/app-router/server-side";

const getTargetUrl = (request: Request) => {
  return request.url.replace(`${new URL(request.url).origin}/api/proxy`, "");
};

export async function GET(request: Request) {
  const url = getTargetUrl(request);

  const r = await appRouterServerSideHttpClient.get(url);

  return Response.json(r.data);
}

export async function POST(request: Request) {
  const url = getTargetUrl(request);

  const r = await appRouterServerSideHttpClient.post(url, request.body);

  return Response.json(r.data);
}

export async function PATCH(request: Request) {
  const url = getTargetUrl(request);

  const r = await appRouterServerSideHttpClient.post(url, request.body);

  return Response.json(r.data);
}

export async function PUT(request: Request) {
  const url = getTargetUrl(request);

  const r = await appRouterServerSideHttpClient.post(url, request.body);

  return Response.json(r.data);
}
