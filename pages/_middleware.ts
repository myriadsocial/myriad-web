import type {NextFetchEvent, NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

import {healthcheck} from 'src/lib/api/healthcheck';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const available = await healthcheck();

  if (!available) {
    const url = req.nextUrl.clone();
    url.pathname = '/maintenance';

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
