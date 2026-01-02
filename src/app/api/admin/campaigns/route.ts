import { NextResponse } from 'next/server';
import { getAllCampaigns } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

// Ensure database is seeded
seedDatabase();

export async function GET() {
  try {
    const campaigns = getAllCampaigns();
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Failed to get campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to get campaigns' },
      { status: 500 }
    );
  }
}
