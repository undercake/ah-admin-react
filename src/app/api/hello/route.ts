/*
 * @Author: Undercake
 * @Date: 2023-08-20 17:19:11
 * @LastEditTime: 2023-08-20 17:19:14
 * @FilePath: /ah-admin-react/src/app/api/hello/route.ts
 * @Description: 
 */
export async function GET(request: Request) {
    console.dir(request);
    return new Response('Hello, Next.js!')
  }