import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-6">
            <svg
              className="w-10 h-10 text-primary-600 dark:text-primary-400"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 10h6v14c0 3.314-2.686 6-6 6v-4c1.105 0 2-.895 2-2V14h-2v-4z"
                fill="currentColor"
              />
              <circle cx="26" cy="20" r="6" stroke="currentColor" strokeWidth="3" fill="none" />
              <path d="M26 17v6l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
            Welcome to <span className="text-primary-600 dark:text-primary-400">J-erif</span>
          </h1>
          
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
            Secure and trusted verification service for U.S. military servicemembers and veterans. 
            Unlock exclusive benefits with quick and easy verification.
          </p>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="card p-6">
            <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Secure</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Your data is encrypted and protected with industry-standard security.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Fast</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Instant verification in most cases. Get verified in under a minute.
            </p>
          </div>
          
          <div className="card p-6">
            <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">Trusted</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Used by leading brands to verify military status accurately.
            </p>
          </div>
        </div>

        {/* Demo Link */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
            Try the Demo
          </h2>
          <p className="text-secondary-600 dark:text-secondary-300 mb-6">
            Experience our verification flow with a sample verification link.
          </p>
          <Link
            href="/verify/military-discount-2024?verificationId=demo-verification-001"
            className="btn-primary inline-flex items-center"
          >
            Start Demo Verification
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Admin Link */}
        <p className="mt-8 text-sm text-secondary-500 dark:text-secondary-400">
          Are you an administrator?{' '}
          <Link href="/admin" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
            Access Admin Panel
          </Link>
        </p>
      </div>
    </div>
  );
}
