'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'How does the verification process work?',
    answer: 'Our verification process is simple and secure. You provide your military service information through our form, and we verify it against official records. The process typically takes just a few seconds for instant verification, though some cases may require manual review.',
  },
  {
    question: 'What information do I need to provide?',
    answer: 'You will need to provide your full name, date of birth, military status (active, retired, or veteran), branch of service, and discharge date. An email address is optional but recommended for receiving verification confirmations.',
  },
  {
    question: 'Is my information secure?',
    answer: 'Yes, we take data security very seriously. All information is encrypted in transit and at rest. We only use your data for verification purposes and do not sell or share it with unauthorized third parties.',
  },
  {
    question: 'What if my verification fails?',
    answer: 'If your verification fails, please double-check that all information entered is accurate. Common issues include typos in names or incorrect dates. If you believe there is an error, you can try again or contact our support team for assistance.',
  },
  {
    question: 'How long is my verification valid?',
    answer: 'Once verified, your military status is typically valid for 1-2 years depending on the merchant\'s policy. Some benefits may require periodic re-verification.',
  },
  {
    question: 'What military statuses are eligible?',
    answer: 'We verify active duty servicemembers, veterans, retirees, and in some cases, military family members. Eligibility depends on the specific program or discount being offered.',
  },
  {
    question: 'Can I use this verification for multiple discounts?',
    answer: 'Each verification link is unique to a specific merchant or program. You will need to complete the verification process separately for each participating merchant.',
  },
  {
    question: 'What if I don\'t have my discharge date?',
    answer: 'If you don\'t remember your exact discharge date, you can request your DD-214 or other military records from the National Personnel Records Center (NPRC). You can also contact our support team for alternative verification options.',
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Find answers to common questions about our military verification service.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="card p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium text-secondary-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-secondary-500 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-white dark:bg-secondary-900">
                    <p className="text-secondary-600 dark:text-secondary-300">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-secondary-600 dark:text-secondary-300 mb-6">
            Our support team is here to assist you with any questions or issues.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">Email Support</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  support@j-erif.com
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                  Response within 24 hours
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">Business Hours</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  Monday - Friday
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                  9:00 AM - 5:00 PM EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
