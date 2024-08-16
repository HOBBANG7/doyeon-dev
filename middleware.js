import { NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|assets/|[\\w-]+\\.\\w+).*)'
  ]
}

export default async function middleware(req) {
  const url = req.nextUrl
  console.log('url', url)

  const hostname = req.headers.get('host').replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
  console.log('hostname', hostname)

  const searchParams = req.nextUrl.searchParams.toString()
  console.log('searchParams', searchParams)

  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`
  console.log('path', path)

  const subDomain = hostname.split('.')[0]
  console.log('subDomain', subDomain)

  switch (true) {
    case subDomain !== hostname:
      return NextResponse.rewrite(new URL(`/${subDomain}${path}`, req.url))

    default:
      return NextResponse.rewrite(new URL(`${path}`, req.url))
  }
}
