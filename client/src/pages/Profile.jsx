import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '../components/Card';
import api from '../services/api';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [apiData, setApiData] = useState(null);
  const [fetchingApi, setFetchingApi] = useState(false);
  const [apiError, setApiError] = useState('');

  // Demonstrate live access to protected /api/auth/me endpoint
  const fetchProtectedProfile = async () => {
    setFetchingApi(true);
    setApiError('');
    try {
      const data = await api.getMe();
      setApiData(data);
    } catch (err) {
      setApiError(err.message || 'Failed to fetch protected profile');
    } finally {
      setFetchingApi(false);
    }
  };

  useEffect(() => {
    fetchProtectedProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Overview Card */}
      <Card className="border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-2xl">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-text">{user?.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  Authenticated
                </span>
              </div>
              <p className="text-muted text-sm">{user?.email}</p>
            </div>
          </div>

          <Button variant="danger" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Account ID</span>
            <p className="mt-1 font-mono text-xs text-text bg-slate-100 p-2 rounded-lg break-all">
              {user?._id || 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Member Since</span>
            <p className="mt-1 text-sm font-semibold text-text">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Session Token</span>
            <p className="mt-1 font-mono text-xs text-text bg-slate-100 p-2 rounded-lg truncate">
              {token ? `${token.substring(0, 24)}...` : 'None'}
            </p>
          </div>
        </div>
      </Card>

      {/* Protected Endpoint Demonstration Card */}
      <Card className="border-border bg-slate-50/50">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-lg">Live Protected Route Verification</CardTitle>
              <CardDescription>
                Demonstrates real-time communication with backend endpoint: <code className="text-xs bg-slate-200 px-1 py-0.5 rounded">GET /api/auth/me</code>
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProtectedProfile}
              disabled={fetchingApi}
            >
              {fetchingApi ? 'Verifying...' : 'Re-verify Endpoint'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {apiError ? (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-error text-sm">
              {apiError}
            </div>
          ) : apiData ? (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                HTTP 200 OK — Protected Route Verified with JWT
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-muted">Awaiting API verification response...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
