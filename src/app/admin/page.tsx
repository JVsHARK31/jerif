'use client';

import { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Verification {
  id: string;
  verification_id: string;
  result_status: string;
  reason_code: string;
  campaign_title: string;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'campaigns' | 'verifications' | 'generate'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setAuthError('Invalid credentials');
      }
    } catch (error) {
      setAuthError('Authentication failed');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campaignsRes, verificationsRes] = await Promise.all([
        fetch('/api/admin/campaigns'),
        fetch(`/api/admin/verifications?status=${statusFilter}&search=${searchQuery}`),
      ]);
      
      if (campaignsRes.ok) {
        const data = await campaignsRes.json();
        setCampaigns(data);
      }
      
      if (verificationsRes.ok) {
        const data = await verificationsRes.json();
        setVerifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLink = async () => {
    if (!selectedCampaign) return;
    
    try {
      const response = await fetch('/api/admin/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: selectedCampaign }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedLink(window.location.origin + data.link);
      }
    } catch (error) {
      console.error('Failed to generate link:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, statusFilter, searchQuery]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
              Admin Login
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 mt-2">
              Enter your credentials to access the admin panel
            </p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="label">Username</label>
              <input
                type="text"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="label">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {authError && (
              <p className="text-red-500 text-sm mb-4">{authError}</p>
            )}
            
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="btn-secondary text-sm"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-secondary-200 dark:border-secondary-700">
          {(['campaigns', 'verifications', 'generate'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-secondary-500 hover:text-secondary-700 dark:text-secondary-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Campaigns
            </h2>
            {loading ? (
              <p className="text-secondary-500">Loading...</p>
            ) : campaigns.length === 0 ? (
              <p className="text-secondary-500">No campaigns found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200 dark:border-secondary-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-secondary-100 dark:border-secondary-800">
                        <td className="py-3 px-4 text-sm font-mono text-secondary-600 dark:text-secondary-400">
                          {campaign.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-secondary-900 dark:text-white">
                          {campaign.title}
                        </td>
                        <td className="py-3 px-4 text-sm text-secondary-500">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <select
                className="select-field sm:w-48"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
              <input
                type="text"
                className="input-field sm:w-64"
                placeholder="Search verification ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {loading ? (
              <p className="text-secondary-500">Loading...</p>
            ) : verifications.length === 0 ? (
              <p className="text-secondary-500">No verifications found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200 dark:border-secondary-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Verification ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Campaign</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.map((v) => (
                      <tr key={v.id} className="border-b border-secondary-100 dark:border-secondary-800">
                        <td className="py-3 px-4 text-sm font-mono text-secondary-600 dark:text-secondary-400">
                          {v.verification_id.substring(0, 20)}...
                        </td>
                        <td className="py-3 px-4 text-sm text-secondary-900 dark:text-white">
                          {v.campaign_title}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            v.result_status === 'VERIFIED'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : v.result_status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {v.result_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-secondary-500">
                          {new Date(v.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Generate Link Tab */}
        {activeTab === 'generate' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Generate Verification Link
            </h2>
            
            <div className="max-w-md">
              <div className="mb-4">
                <label className="label">Select Campaign</label>
                <select
                  className="select-field"
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                >
                  <option value="">Choose a campaign...</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={generateLink}
                disabled={!selectedCampaign}
                className="btn-primary"
              >
                Generate Link
              </button>
              
              {generatedLink && (
                <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Generated Link:
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="input-field text-sm font-mono"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedLink)}
                      className="btn-secondary px-3"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
