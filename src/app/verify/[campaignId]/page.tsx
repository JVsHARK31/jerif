'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage({ params }: { params: { campaignId: string } }) {
  const searchParams = useSearchParams();
  const verificationId = searchParams?.get('verificationId') || '';
  
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        if (!verificationId) {
          setHtml(getInvalidLinkHTML());
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/session?campaignId=${params.campaignId}&verificationId=${verificationId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to load session');
        }
        
        const session = await response.json();
        const formFields = session.form_schema?.fields || [];
        const fieldsHTML = renderFormFields(formFields);
        const pageHTML = getVerificationPageHTML(session, fieldsHTML, verificationId, params.campaignId);
        setHtml(pageHTML);
      } catch (error) {
        console.error('Error:', error);
        setHtml(getErrorPageHTML());
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [verificationId, params.campaignId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verification...</p>
        </div>
      </div>
    );
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function renderFormFields(fields: any[]) {
  return fields.map((field: any) => {
    if (field.type === 'select') {
      const options = field.options?.map((opt: any) => 
        `<option value="${opt.value}">${opt.label}</option>`
      ).join('') || '';
      
      return `
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ${field.label}
            ${field.required ? '<span class="text-red-500">*</span>' : ''}
          </label>
          <select name="${field.name}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" ${field.required ? 'required' : ''}>
            <option value="">Select ${field.label.toLowerCase()}</option>
            ${options}
          </select>
        </div>
      `;
    } else if (field.type === 'date') {
      return `
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ${field.label}
            ${field.required ? '<span class="text-red-500">*</span>' : ''}
          </label>
          <input type="date" name="${field.name}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" ${field.required ? 'required' : ''} />
        </div>
      `;
    } else {
      return `
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ${field.label}
            ${field.required ? '<span class="text-red-500">*</span>' : ''}
          </label>
          <input type="${field.type || 'text'}" name="${field.name}" placeholder="${field.placeholder || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" ${field.required ? 'required' : ''} />
        </div>
      `;
    }
  }).join('');
}

function getVerificationPageHTML(session: any, fieldsHTML: string, verificationId: string, campaignId: string) {
  const successHTML = getSuccessHTML();
  const formScript = getFormScript(verificationId, campaignId, successHTML);
  
  return `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <h1 class="text-2xl font-bold text-white">${session.campaign_title || 'Verification'}</h1>
            <p class="text-blue-100 mt-2">${session.campaign_description || ''}</p>
          </div>
          <div class="p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Verify Your Military Status</h2>
            <form id="verificationForm" class="space-y-4">
              ${fieldsHTML}
              <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-medium mt-8">
                Verify My Eligibility
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    ${formScript}
  `;
}

function getFormScript(verificationId: string, campaignId: string, successHTML: string) {
  return `
    <script>
      const verificationId = '${verificationId}';
      const campaignId = '${campaignId}';
      const successHTML = \`${successHTML.replace(/`/g, '\\`')}\`;
      
      document.getElementById('verificationForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
          const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              verification_id: verificationId,
              campaign_id: campaignId,
              form_data: data,
            }),
          });
          
          const result = await response.json();
          if (response.ok) {
            document.body.innerHTML = successHTML.replace('{{referenceId}}', result.reference_id || 'N/A').replace('{{message}}', result.message || 'Your military status has been verified.');
          } else {
            alert('Verification failed: ' + (result.error || 'Unknown error'));
          }
        } catch (error) {
          alert('Error: ' + error.message);
        }
      });
    </script>
  `;
}

function getInvalidLinkHTML() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Invalid Link</h2>
          <p class="text-gray-600">This verification link is invalid or has expired.</p>
          <a href="/" class="mt-6 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go Home
          </a>
        </div>
      </div>
    </div>
  `;
}

function getErrorPageHTML() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p class="text-gray-600">Failed to load verification session. Please try again.</p>
          <a href="/" class="mt-6 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go Home
          </a>
        </div>
      </div>
    </div>
  `;
}

function getSuccessHTML() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Verification Successful!</h2>
        <p class="text-gray-600 mb-4">{{message}}</p>
        <p class="text-sm text-gray-500">Reference ID: <strong>{{referenceId}}</strong></p>
        <a href="/" class="mt-6 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Go Home
        </a>
      </div>
    </div>
  `;
}
