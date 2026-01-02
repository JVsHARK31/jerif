export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-secondary dark:prose-invert max-w-none">
            <p className="text-secondary-600 dark:text-secondary-300 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                J-erif ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our 
                military verification service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                2. Information We Collect
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                We collect information that you provide directly to us when using our verification service:
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-300 space-y-2">
                <li>Full name (first and last name)</li>
                <li>Date of birth</li>
                <li>Military service status</li>
                <li>Branch of service</li>
                <li>Discharge date</li>
                <li>Email address (optional)</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-300 space-y-2">
                <li>Verify your military service status</li>
                <li>Process your eligibility for military discounts and benefits</li>
                <li>Communicate with you about your verification status</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                4. Data Security
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                We implement appropriate technical and organizational security measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                These measures include:
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-300 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure server infrastructure</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication measures</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                5. Data Retention
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes 
                for which it was collected, including to satisfy any legal, accounting, or reporting requirements.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                6. Your Rights
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-300 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Request data portability</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                7. Third-Party Sharing
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-secondary-600 dark:text-secondary-300 space-y-2">
                <li>Service providers who assist in verification processing</li>
                <li>Business partners offering military discounts (verification status only)</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
                8. Contact Us
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-secondary-600 dark:text-secondary-300">
                Email: privacy@j-erif.com<br />
                Address: 123 Verification Street, Suite 100, Tech City, TC 12345
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
