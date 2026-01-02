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
  const verificationId = searchParams?.get('verificationId');
  
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
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          throw new Error(data.error || 'Failed to load verification session');
        } catch {
          throw new Error('Failed to load verification session');
        }
      }
      
      const data = await response.json();
      setSession(data);
    } catch (err: any) {
      console.error('Session error:', err);
      setError(err.message || 'Failed to load verification session');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verification_id: verificationId,
          campaign_id: params.campaignId,
          form_data: formData,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          throw new Error(data.error || 'Verification failed');
        } catch {
          throw new Error('Verification failed');
        }
      }

      const data = await response.json();
      setResult({
        status: data.status || 'VERIFIED',
        message: data.message || 'Verification successful!',
        referenceId: data.reference_id,
      });
      setCurrentStep(3);
    } catch (err: any) {
      console.error('Submit error:', err);
      setResult({
        status: 'FAILED',
        message: err.message || 'Verification failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-secondary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-secondary-600 dark:text-secondary-300">Loading verification...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">Session Error</h2>
            <p className="text-secondary-600 dark:text-secondary-300">{error || 'Failed to load verification session'}</p>
            <a href="/" className="mt-6 inline-block px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition">
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
            <h1 className="text-2xl font-bold text-white">{session.campaign_title}</h1>
            <p className="text-primary-100 mt-2">{session.campaign_description}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Step Indicator */}
            <StepIndicator steps={steps} currentStep={currentStep} />

            {/* Form or Result */}
            {currentStep === 1 && !result && (
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
                  Verify Your Military Status
                </h2>
                <VerificationForm
                  fields={session.form_schema.fields}
                  onSubmit={handleSubmit}
                  isLoading={isSubmitting}
                />
              </div>
            )}

            {result && (
              <div>
                <VerificationResult
                  status={result.status}
                  message={result.message}
                  referenceId={result.referenceId}
                  canRetry={result.status === 'FAILED'}
                  onRetry={() => {
                    setResult(null);
                    setCurrentStep(1);
                  }}
                />
              </div>
            )}

            {/* Program Info */}
            {currentStep === 1 && (
              <div className="mt-8 pt-8 border-t border-secondary-200 dark:border-secondary-700">
                <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {session.program_info.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-secondary-600 dark:text-secondary-300">
                      <svg className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-secondary-600 dark:text-secondary-400 text-sm">
          <p>Powered by <span className="font-semibold text-primary-500">J-erif</span> 2026</p>
        </div>
      </div>
    </div>
  );
}
