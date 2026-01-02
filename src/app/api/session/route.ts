import { NextRequest, NextResponse } from 'next/server';
import { getSession, createAuditLog } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

// Initialize database with seed data
seedDatabase();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const campaignId = searchParams.get('campaignId');
    const verificationId = searchParams.get('verificationId');

    if (!campaignId || !verificationId) {
      return NextResponse.json(
        { error: 'Missing campaignId or verificationId' },
        { status: 400 }
      );
    }

    // Get session from database
    const session = getSession(verificationId);

    if (!session) {
      return NextResponse.json(
        { error: 'Verification session not found. Please check your link.' },
        { status: 404 }
      );
    }

    // Check if session belongs to the correct campaign
    if (session.campaign_id !== campaignId) {
      return NextResponse.json(
        { error: 'Invalid verification link.' },
        { status: 400 }
      );
    }

    // Check if session is expired
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json({
        ...session,
        status: 'EXPIRED',
      });
    }

    // Log session access
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    createAuditLog({
      action: 'SESSION_ACCESSED',
      verification_id: verificationId,
      ip,
      user_agent: userAgent,
    });

    return NextResponse.json(session);
  } catch (error: any) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
