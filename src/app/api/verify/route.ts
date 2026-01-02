import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSession, updateSessionStatus, createVerification, createAuditLog } from '@/lib/db';
import { verifyWithProvider, verifyDirect, FormData } from '@/lib/verificationProvider';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Rate limiting
    const rateLimitKey = `verify:${ip}`;
    const rateLimit = checkRateLimit(rateLimitKey, { windowMs: 60000, maxRequests: 5 });
    
    if (!rateLimit.allowed) {
      createAuditLog({
        action: 'RATE_LIMITED',
        ip,
        user_agent: userAgent,
        details: { remaining: rateLimit.remaining, resetAt: rateLimit.resetAt },
      });
      
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { campaignId, verificationId, formData } = body;

    // Validate required fields
    if (!campaignId || !verificationId || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get session
    const session = getSession(verificationId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Verification session not found' },
        { status: 404 }
      );
    }

    // Check session status
    if (session.status === 'USED') {
      return NextResponse.json(
        { error: 'This verification link has already been used' },
        { status: 400 }
      );
    }

    // Check expiration
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'This verification link has expired' },
        { status: 400 }
      );
    }

    // Sanitize and validate form data
    const sanitizedFormData: FormData = {
      status: String(formData.status || '').trim(),
      branch_of_service: String(formData.branch_of_service || '').trim(),
      first_name: String(formData.first_name || '').trim(),
      last_name: String(formData.last_name || '').trim(),
      date_of_birth: String(formData.date_of_birth || '').trim(),
      discharge_date: String(formData.discharge_date || '').trim(),
      email: formData.email ? String(formData.email).trim() : undefined,
    };

    // Validate required fields
    const requiredFields = ['status', 'branch_of_service', 'first_name', 'last_name', 'date_of_birth', 'discharge_date'];
    for (const field of requiredFields) {
      if (!sanitizedFormData[field as keyof FormData]) {
        return NextResponse.json(
          { error: `${field.replace('_', ' ')} is required` },
          { status: 400 }
        );
      }
    }

    // Log verification attempt
    createAuditLog({
      action: 'VERIFICATION_ATTEMPT',
      verification_id: verificationId,
      ip,
      user_agent: userAgent,
      details: { 
        campaign_id: campaignId,
        status: sanitizedFormData.status,
        branch: sanitizedFormData.branch_of_service,
      },
    });

    // Call verification provider
    let result;
    try {
      // Try to verify with the Veterans API first
      result = await verifyWithProvider(session, sanitizedFormData);
    } catch (providerError) {
      // Fallback to direct verification if API is unavailable
      console.log('Provider unavailable, using direct verification');
      result = await verifyDirect(sanitizedFormData);
    }

    // Generate verification ID
    const verificationRecordId = uuidv4();
    const referenceId = result.referenceId || `JRF-${Date.now()}-${verificationRecordId.substring(0, 8).toUpperCase()}`;

    // Save verification result
    createVerification({
      id: verificationRecordId,
      verification_id: verificationId,
      result_status: result.status,
      reason_code: result.reasonCode,
      reason_message: result.reasonMessage,
      form_data: sanitizedFormData,
      raw_provider_response: result.providerPayload,
    });

    // Update session status if verified
    if (result.status === 'VERIFIED') {
      updateSessionStatus(verificationId, 'USED');
    }

    // Log result
    createAuditLog({
      action: 'VERIFICATION_RESULT',
      verification_id: verificationId,
      ip,
      user_agent: userAgent,
      details: { 
        status: result.status,
        reason_code: result.reasonCode,
        reference_id: referenceId,
      },
    });

    return NextResponse.json({
      status: result.status,
      message: result.reasonMessage || getDefaultMessage(result.status),
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

function getDefaultMessage(status: string): string {
  switch (status) {
    case 'VERIFIED':
      return 'Your military service has been verified successfully.';
    case 'PENDING':
      return 'Your verification is being processed. You will receive an email once the review is complete.';
    case 'FAILED':
      return 'We could not verify your military service with the information provided.';
    default:
      return 'Verification status unknown.';
  }
}
