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

  const hostname = req.headers.get('host').replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
  const searchParams = req.nextUrl.searchParams.toString()

  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

  const subDomain = hostname.split('.')[0]

  switch (true) {
    case subDomain !== hostname:
      return NextResponse.rewrite(new URL(`/${subDomain}${path}`, req.url))

    default:
      return NextResponse.rewrite(new URL(`${path}`, req.url))
  }
}
