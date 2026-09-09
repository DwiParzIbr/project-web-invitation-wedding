import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL('/', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.delete('weddora_session');
  return response;
}

export async function POST(request: Request) {
  const url = new URL('/', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.delete('weddora_session');
  return response;
}
