import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationLink } from '@/lib/seed';
import { getCampaign } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Verify campaign exists
    const campaign = getCampaign(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const link = generateVerificationLink(campaignId);
    
    return NextResponse.json({ link });
  } catch (error) {
    console.error('Failed to generate link:', error);
    return NextResponse.json(
      { error: 'Failed to generate link' },
      { status: 500 }
    );
  }
}
