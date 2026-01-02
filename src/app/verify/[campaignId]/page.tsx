'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import StepIndicator from '@/components/StepIndicator';
import VerificationForm from '@/components/VerificationForm';
import VerificationResult from '@/components/VerificationResult';

interface SessionData {
  verification_id: string;
  campaign_id: string;
  status: string;
  expires_at: string;
  campaign_title: string;
  campaign_description: string;
  form_schema: {
    fields: any[];
  };
  program_info: {
    benefits: string[];
    terms: string;
    privacy_note: string;
  };
}

interface VerificationResultData {
  status: 'VERIFIED' | 'PENDING' | 'FAILED';
  message: string;
  referenceId?: string;
}

const steps = [
  { id: 1, title: 'Fill Data' },
  { id: 2, title: 'Verify' },
  { id: 3, title: 'Complete' },
];

export default function VerifyPage({ params }: { params: { campaignId: string } }) {
  const searchParams = useSearchParams();
  const verificationId = searchParams.get('verificationId');
  
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<VerificationResultData | null>(null);

  useEffect(() => {
    if (!verificationId) {
      setError('Invalid verification link. Please check the URL and try again.');
      setLoading(false);
      return;
    }

    fetchSession();
  }, [verificationId, params.campaignId]);

  const fetchSession = async () => {
    try {
      const response = await fetch(
        `/api/session?campaignId=${params.campaignId}&verificationId=${verificationId}`
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load verification session');
      }
      
      const data = await response.json();
      setSession(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: Record<string, string>) => {
    setIsSubmitting(true);
    setCurrentStep(2);
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: params.campaignId,
          verificationId,
          formData,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      
      setResult({
        status: data.status,
        message: data.message,
        referenceId: data.referenceId,
      });
      setCurrentStep(3);
    } catch (err: any) {
      setResult({
        status: 'FAILED',
        message: err.message,
      });
      setCurrentStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setCurrentStep(1);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-secondary-600 dark:text-secondary-400">Loading verification...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Session Error
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            {error}
          </p>
          <a href="/help" className="btn-secondary inline-flex items-center">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  if (session?.status === 'EXPIRED') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Link Expired
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            This verification link has expired. Please request a new verification link.
          </p>
          <a href="/help" className="btn-secondary inline-flex items-center">
            Request New Link
          </a>
        </div>
      </div>
    );
  }

  if (session?.status === 'USED') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Already Verified
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            This verification link has already been used. If you need to verify again, please request a new link.
          </p>
          <a href="/help" className="btn-secondary inline-flex items-center">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        {/* Main Card */}
        <div className="card p-6 sm:p-8">
          {/* Program Info */}
          {currentStep === 1 && session && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                  {session.campaign_title}
                </h1>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {session.campaign_description}
                </p>
              </div>
              
              {/* Benefits */}
              {session.program_info?.benefits && (
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-primary-800 dark:text-primary-300 mb-2">
                    Benefits
                  </h3>
                  <ul className="space-y-1">
                    {session.program_info.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-sm text-primary-700 dark:text-primary-400">
                        <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Form */}
              <VerificationForm
                fields={session.form_schema.fields}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            </>
          )}
          
          {/* Verifying State */}
          {currentStep === 2 && isSubmitting && (
            <div className="text-center py-12">
              <svg className="animate-spin h-16 w-16 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mt-6 mb-2">
                Verifying Your Information
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Please wait while we verify your military service...
              </p>
            </div>
          )}
          
          {/* Result */}
          {currentStep === 3 && result && (
            <VerificationResult
              status={result.status}
              message={result.message}
              referenceId={result.referenceId}
              onRetry={handleRetry}
              canRetry={result.status === 'FAILED'}
            />
          )}
        </div>
        
        {/* Privacy Note */}
        {session?.program_info?.privacy_note && currentStep === 1 && (
          <p className="text-xs text-secondary-500 dark:text-secondary-400 text-center mt-4">
            {session.program_info.privacy_note}
          </p>
        )}
      </div>
    </div>
  );
}
