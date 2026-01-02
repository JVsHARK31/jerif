'use client';

interface VerificationResultProps {
  status: 'VERIFIED' | 'PENDING' | 'FAILED';
  message: string;
  referenceId?: string;
  onRetry?: () => void;
  canRetry?: boolean;
}

export default function VerificationResult({
  status,
  message,
  referenceId,
  onRetry,
  canRetry = false,
}: VerificationResultProps) {
  const statusConfig = {
    VERIFIED: {
      icon: (
        <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Verification Successful',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      titleColor: 'text-green-700 dark:text-green-400',
    },
    PENDING: {
      icon: (
        <svg className="w-16 h-16 text-amber-500 animate-pulse-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Verification Pending',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      titleColor: 'text-amber-700 dark:text-amber-400',
    },
    FAILED: {
      icon: (
        <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Verification Failed',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      titleColor: 'text-red-700 dark:text-red-400',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`animate-fade-in rounded-xl p-8 ${config.bgColor} border ${config.borderColor}`}>
      <div className="flex flex-col items-center text-center">
        {config.icon}
        
        <h2 className={`text-2xl font-bold mt-4 ${config.titleColor}`}>
          {config.title}
        </h2>
        
        <p className="text-secondary-600 dark:text-secondary-300 mt-3 max-w-md">
          {message}
        </p>
        
        {referenceId && (
          <div className="mt-6 p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
            <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
              Verification Reference ID
            </p>
            <p className="text-lg font-mono font-semibold text-secondary-900 dark:text-white mt-1">
              {referenceId}
            </p>
          </div>
        )}
        
        {status === 'VERIFIED' && (
          <div className="mt-6 p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 w-full max-w-sm">
            <p className="text-sm text-secondary-600 dark:text-secondary-300">
              Your military service has been verified. You can now access exclusive benefits and discounts.
            </p>
          </div>
        )}
        
        {status === 'PENDING' && (
          <div className="mt-6 p-4 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 w-full max-w-sm">
            <p className="text-sm text-secondary-600 dark:text-secondary-300">
              Your verification is being reviewed. You will receive an email notification once the review is complete.
            </p>
          </div>
        )}
        
        {status === 'FAILED' && canRetry && onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary mt-6"
          >
            Try Again
          </button>
        )}
        
        {status === 'FAILED' && !canRetry && (
          <div className="mt-6">
            <a
              href="/help"
              className="btn-secondary inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Contact Support
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
