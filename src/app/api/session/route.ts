import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for sessions (will be reset on deployment)
const sessions = new Map();

// Campaign configurations
const campaigns = {
  'military-discount-2024': {
    id: 'military-discount-2024',
    name: 'Military Discount Program 2024',
    description: 'Exclusive discounts for U.S. military servicemembers and veterans',
    form_fields: [
      {
        name: 'status',
        type: 'select',
        label: 'Status',
        required: true,
        options: [
          { value: 'Active Duty', label: 'Active Duty' },
          { value: 'Retired', label: 'Retired' },
          { value: 'Veteran/Discharged', label: 'Veteran/Discharged' }
        ]
      },
      {
        name: 'branch_of_service',
        type: 'select',
        label: 'Branch of Service',
        required: true,
        options: [
          { value: 'Army', label: 'Army' },
          { value: 'Navy', label: 'Navy' },
          { value: 'Air Force', label: 'Air Force' },
          { value: 'Marines', label: 'Marines' },
          { value: 'Coast Guard', label: 'Coast Guard' },
          { value: 'Space Force', label: 'Space Force' }
        ]
      },
      {
        name: 'first_name',
        type: 'text',
        label: 'First Name',
        required: true,
        placeholder: 'Enter your first name'
      },
      {
        name: 'last_name',
        type: 'text',
        label: 'Last Name',
        required: true,
        placeholder: 'Enter your last name'
      },
      {
        name: 'date_of_birth',
        type: 'date',
        label: 'Date of Birth',
        required: true,
        hint: 'Used for verification purposes only'
      },
      {
        name: 'discharge_date',
        type: 'date',
        label: 'Discharge Date',
        required: true,
        hint: 'Used for verification purposes only'
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: false,
        placeholder: 'your@email.com',
        hint: 'Personal email address is recommended'
      }
    ]
  }
};

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

    // Get campaign configuration
    const campaign = campaigns[campaignId as keyof typeof campaigns];
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check if session exists in memory
    let session = sessions.get(verificationId);
    
    // If not found, create a new session
    if (!session) {
      session = {
        id: verificationId,
        campaign_id: campaignId,
        form_schema: campaign.form_fields,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };
      sessions.set(verificationId, session);
    }

    // Check if session is expired
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json({
        ...session,
        status: 'EXPIRED',
      });
    }

    return NextResponse.json(session);
  } catch (error: any) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
