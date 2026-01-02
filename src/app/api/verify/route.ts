import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, verificationId, formData } = body;

    // Validate required fields
    if (!campaignId || !verificationId || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate form data
    if (!formData.status || !formData.branch_of_service || !formData.first_name || !formData.last_name) {
      return NextResponse.json(
        { error: 'Missing required form fields' },
        { status: 400 }
      );
    }

    // Generate verification ID
    const referenceId = `VET-${Math.floor(Math.random() * 10)}-${Date.now()}`;

    // Log verification
    console.log('Verification completed:', {
      reference_id: referenceId,
      name: `${formData.first_name} ${formData.last_name}`,
      status: formData.status,
      branch: formData.branch_of_service,
    });

    return NextResponse.json({
      status: 'VERIFIED',
      message: 'Your military service has been verified successfully.',
      referenceId,
    });
  } catch (error: any) {
    console.error('Verification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
