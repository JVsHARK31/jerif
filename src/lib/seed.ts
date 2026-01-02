import { createCampaign, createSession, getCampaign, getSession } from './db';
import { v4 as uuidv4 } from 'uuid';

export function seedDatabase() {
  // Check if default campaign exists
  const existingCampaign = getCampaign('military-discount-2024');
  
  if (!existingCampaign) {
    // Create default campaign
    createCampaign({
      id: 'military-discount-2024',
      title: 'Military Discount Program',
      description: 'Exclusive discounts for U.S. military servicemembers and veterans. Verify your service to unlock special offers.',
      form_schema: {
        fields: [
          {
            name: 'status',
            type: 'select',
            label: 'Status',
            required: true,
            options: [
              { value: 'Active', label: 'Active Duty' },
              { value: 'Retired', label: 'Retired' },
              { value: 'Discharged', label: 'Veteran/Discharged' },
            ],
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
              { value: 'Space Force', label: 'Space Force' },
            ],
          },
          {
            name: 'first_name',
            type: 'text',
            label: 'First Name',
            required: true,
            placeholder: 'Enter your first name',
          },
          {
            name: 'last_name',
            type: 'text',
            label: 'Last Name',
            required: true,
            placeholder: 'Enter your last name',
          },
          {
            name: 'date_of_birth',
            type: 'date',
            label: 'Date of Birth',
            required: true,
            hint: 'Used for verification purposes only',
          },
          {
            name: 'discharge_date',
            type: 'date',
            label: 'Discharge Date',
            required: true,
            hint: 'Used for verification purposes only',
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email Address',
            required: false,
            placeholder: 'your@email.com',
            hint: 'Personal email address is recommended',
          },
        ],
      },
      program_info: {
        benefits: [
          'Up to 20% discount on all products',
          'Free shipping on orders over $50',
          'Exclusive access to member-only sales',
        ],
        terms: 'Offer valid for verified U.S. military servicemembers and veterans only.',
        privacy_note: 'Your information is securely processed and will not be shared with third parties.',
      },
    });
    
    console.log('Created default campaign: military-discount-2024');
  }

  // Create a sample active session if none exists
  const sampleVerificationId = 'demo-verification-001';
  const existingSession = getSession(sampleVerificationId);
  
  if (!existingSession) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days
    
    createSession({
      verification_id: sampleVerificationId,
      campaign_id: 'military-discount-2024',
      expires_at: expiresAt.toISOString(),
    });
    
    console.log('Created sample session: demo-verification-001');
  }
}

// Generate a new verification link
export function generateVerificationLink(campaignId: string): string {
  const verificationId = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days
  
  createSession({
    verification_id: verificationId,
    campaign_id: campaignId,
    expires_at: expiresAt.toISOString(),
  });
  
  return `/verify/${campaignId}?verificationId=${verificationId}`;
}
