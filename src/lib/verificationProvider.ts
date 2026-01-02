/**
 * Verification Provider Adapter
 * This module connects to the Veterans API for verification
 * You can replace this with your own verification API
 */

export interface VerificationResult {
  status: 'VERIFIED' | 'PENDING' | 'FAILED';
  reasonCode?: string;
  reasonMessage?: string;
  providerPayload?: any;
  referenceId?: string;
}

export interface FormData {
  status: string;
  branch_of_service: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  discharge_date: string;
  email?: string;
}

// Veterans API base URL - can be configured via environment variable
const VETERANS_API_URL = process.env.VETERANS_API_URL || 'http://localhost:8000';

export async function verifyWithProvider(
  session: any,
  formData: FormData
): Promise<VerificationResult> {
  try {
    // Search for veteran in the Veterans API
    const searchParams = new URLSearchParams({
      first_name: formData.first_name,
      last_name: formData.last_name,
      status: formData.status,
      branch: formData.branch_of_service,
    });

    const response = await fetch(
      `${VETERANS_API_URL}/veterans/search?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return {
        status: 'FAILED',
        reasonCode: 'API_ERROR',
        reasonMessage: 'Unable to connect to verification service. Please try again later.',
        providerPayload: { error: response.statusText },
      };
    }

    const veterans = await response.json();

    // Check if any veteran matches
    if (veterans && veterans.length > 0) {
      // Find exact match by checking date of birth and discharge date
      const matchedVeteran = veterans.find((v: any) => {
        const dobMatch = v.date_of_birth === formData.date_of_birth;
        const dischargeMatch = v.discharge_date === formData.discharge_date;
        return dobMatch && dischargeMatch;
      });

      if (matchedVeteran) {
        return {
          status: 'VERIFIED',
          reasonCode: 'MATCH_FOUND',
          reasonMessage: 'Your military service has been verified successfully.',
          providerPayload: {
            veteran_id: matchedVeteran.id,
            branch: matchedVeteran.branch_of_service,
            status: matchedVeteran.status,
          },
          referenceId: `VET-${matchedVeteran.id}-${Date.now()}`,
        };
      } else {
        // Partial match - dates don't match
        return {
          status: 'FAILED',
          reasonCode: 'DATE_MISMATCH',
          reasonMessage: 'The dates provided do not match our records. Please verify your date of birth and discharge date.',
          providerPayload: { partial_match: true },
        };
      }
    }

    // No match found
    return {
      status: 'FAILED',
      reasonCode: 'NO_MATCH',
      reasonMessage: 'We could not verify your military service with the information provided. Please check your details and try again.',
      providerPayload: { veterans_found: 0 },
    };
  } catch (error: any) {
    console.error('Verification error:', error);
    
    // If API is not available, return pending for manual review
    return {
      status: 'PENDING',
      reasonCode: 'MANUAL_REVIEW',
      reasonMessage: 'Your verification is being processed. You will receive an email once the review is complete.',
      providerPayload: { error: error.message },
    };
  }
}

// Alternative: Direct database verification (for demo without API)
export async function verifyDirect(formData: FormData): Promise<VerificationResult> {
  // This is a fallback that simulates verification
  // In production, this would connect to your actual verification database
  
  const referenceId = `JRF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  // Simulate verification logic
  if (formData.first_name && formData.last_name && formData.date_of_birth && formData.discharge_date) {
    // Simple validation - in production this would be more sophisticated
    const birthYear = new Date(formData.date_of_birth).getFullYear();
    const dischargeYear = new Date(formData.discharge_date).getFullYear();
    
    // Basic sanity checks
    if (birthYear > 2005 || birthYear < 1940) {
      return {
        status: 'FAILED',
        reasonCode: 'INVALID_DOB',
        reasonMessage: 'The date of birth provided is outside the valid range.',
        referenceId,
      };
    }
    
    if (dischargeYear > new Date().getFullYear() + 1 || dischargeYear < 1950) {
      return {
        status: 'FAILED',
        reasonCode: 'INVALID_DISCHARGE',
        reasonMessage: 'The discharge date provided is outside the valid range.',
        referenceId,
      };
    }
    
    // Age at discharge check
    const ageAtDischarge = dischargeYear - birthYear;
    if (ageAtDischarge < 17 || ageAtDischarge > 70) {
      return {
        status: 'FAILED',
        reasonCode: 'AGE_MISMATCH',
        reasonMessage: 'The age at discharge does not fall within acceptable military service parameters.',
        referenceId,
      };
    }
    
    // If all checks pass, verify
    return {
      status: 'VERIFIED',
      reasonCode: 'VERIFIED',
      reasonMessage: 'Your military service has been verified successfully.',
      referenceId,
    };
  }
  
  return {
    status: 'FAILED',
    reasonCode: 'INCOMPLETE_DATA',
    reasonMessage: 'Please provide all required information.',
    referenceId,
  };
}
