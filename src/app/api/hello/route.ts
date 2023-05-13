export async function GET(request: Request) {
  console.dir(request);
  return new Response('Hello, Next.js!')
}
