import { NextRequest, NextResponse } from 'next/server';
import { getAllVerifications } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const verifications = getAllVerifications({ status, search });
    return NextResponse.json(verifications);
  } catch (error) {
    console.error('Failed to get verifications:', error);
    return NextResponse.json(
      { error: 'Failed to get verifications' },
      { status: 500 }
    );
  }
}
