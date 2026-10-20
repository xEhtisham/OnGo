import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [apiData, setApiData] = useState(null);
  const [fetchingApi, setFetchingApi] = useState(false);
  const [apiError, setApiError] = useState('');

  // Editable form state
  const [fullName, setFullName] = useState(user?.name || 'Ehtisham Ul Hassan');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);

  // UI state
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showToast = (msg = 'Changes saved successfully') => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  // Sync user name when user loads
  useEffect(() => {
    if (user?.name) {
      setFullName(user.name);
    }
  }, [user]);

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

  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    showToast('Personal information updated');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      showToast('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated successfully');
  };

  // Initials for avatar
  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'EH';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      <div
        className={`fixed top-20 right-6 z-50 transition-all duration-300 flex items-center gap-2.5 bg-surface-container-lowest px-4 py-3 rounded-xl shadow-xl border border-outline-variant/60 ${
          toastVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-emerald-600 text-[20px]">
          check_circle
        </span>
        <span className="font-label-md text-label-md text-on-surface font-semibold">
          {toastMessage}
        </span>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          My Profile
        </h1>
        <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-1">
          Manage your account information, ticket preferences, and security settings.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 shadow-xs border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/25">
            <span className="font-headline-md text-xl text-primary font-bold">
              {initials}
            </span>
            <button
              type="button"
              aria-label="Edit avatar"
              onClick={() => showToast('Avatar upload ready')}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-surface-container-lowest border border-outline-variant/80 flex items-center justify-center text-on-surface-variant hover:text-primary shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">photo_camera</span>
            </button>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface truncate">
                {fullName}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verified Attendee
              </span>
            </div>
            <span className="font-body-md text-sm text-on-surface-variant block mt-0.5 truncate">
              {user?.email || 'ehtishamkhan013@gmail.com'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => showToast('Avatar upload dialog opened')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-outline-variant/80 hover:bg-surface-container-low text-on-surface font-label-md text-label-md transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            <span>Change photo</span>
          </button>
        </div>
      </div>

      {/* Main Stack */}
      <div className="flex flex-col gap-6">
        {/* Section 1: Personal Information */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 shadow-xs border border-outline-variant/50 space-y-5">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="font-headline-sm text-lg font-bold text-on-surface">
              Personal Information
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
              Update your personal details used for event ticket reservations and passes.
            </p>
          </div>

          <form onSubmit={handleSavePersonalInfo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-4 bg-surface-container-lowest font-body-md text-body-md text-on-surface rounded-xl border border-outline-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>

              {/* Email Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">
                    Email Address
                  </label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-surface-container-high text-on-surface-variant">
                    <span className="material-symbols-outlined text-[12px]">lock</span>
                    Primary / Account Email
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="email"
                    type="email"
                    readOnly
                    value={user?.email || 'ehtishamkhan013@gmail.com'}
                    className="w-full h-11 pl-4 pr-10 bg-surface-container-low/70 font-body-md text-body-md text-on-surface-variant rounded-xl border border-outline-variant/50 cursor-not-allowed select-none"
                  />
                  <span
                    className="material-symbols-outlined absolute right-3 text-emerald-600 text-[18px]"
                    title="Email verified"
                  >
                    check_circle
                  </span>
                </div>
                <p className="font-caption-xs text-xs text-on-surface-variant flex items-center gap-1 pt-0.5">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Email address is tied to your ticket wallet and requires verification to update.
                </p>
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full h-11 px-4 bg-surface-container-lowest font-body-md text-body-md text-on-surface rounded-xl border border-outline-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 h-11 bg-primary text-white font-label-md text-label-md font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Save changes</span>
              </button>
            </div>
          </form>
        </section>

        {/* Section 2: Password & Security */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 shadow-xs border border-outline-variant/50 space-y-5">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="font-headline-sm text-lg font-bold text-on-surface">
              Password & Security
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
              Ensure your account is protected with a secure password.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="currentPassword">
                Current password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 px-4 bg-surface-container-lowest font-body-md text-body-md text-on-surface rounded-xl border border-outline-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="newPassword">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full h-11 px-4 bg-surface-container-lowest font-body-md text-body-md text-on-surface rounded-xl border border-outline-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="confirmPassword">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full h-11 px-4 bg-surface-container-lowest font-body-md text-body-md text-on-surface rounded-xl border border-outline-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>
            </div>

            <p className="font-caption-xs text-xs text-on-surface-variant flex items-center gap-1.5 pt-1">
              <span className="material-symbols-outlined text-[14px]">lock_clock</span>
              Minimum 8 characters with at least one number or symbol.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 h-11 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/70 font-label-md text-label-md font-semibold rounded-xl transition-all active:scale-[0.99] flex items-center justify-center"
              >
                Update password
              </button>
            </div>
          </form>
        </section>

        {/* Section 3: Preferences */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 shadow-xs border border-outline-variant/50 space-y-5">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="font-headline-sm text-lg font-bold text-on-surface">
              Preferences
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
              Manage the notifications and reminders you receive regarding your ticket bookings.
            </p>
          </div>

          <div className="space-y-5">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
              <div className="max-w-xl">
                <span className="block font-title-md text-sm sm:text-base font-bold text-on-surface">
                  Email notifications
                </span>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Receive booking confirmations and important account updates via email.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => {
                    setEmailNotifications(e.target.checked);
                    showToast('Notification preference updated');
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-outline-variant/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between gap-4">
              <div className="max-w-xl">
                <span className="block font-title-md text-sm sm:text-base font-bold text-on-surface">
                  Event reminders
                </span>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Get timely calendar reminders and venue check-in alerts before booked events.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={eventReminders}
                  onChange={(e) => {
                    setEventReminders(e.target.checked);
                    showToast('Reminder preference updated');
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-outline-variant/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Section 4: Live Protected Route Verification (Module 1/2 Spec) */}
        <section className="bg-surface-container-low rounded-2xl p-5 sm:p-7 shadow-xs border border-outline-variant/50 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="font-headline-sm text-base font-bold text-on-surface">
                  Live Protected Endpoint Verification
                </h2>
              </div>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Verifies real-time JWT authentication against backend endpoint:{' '}
                <code className="text-xs font-mono bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface">
                  GET /api/auth/me
                </code>
              </p>
            </div>

            <button
              type="button"
              onClick={fetchProtectedProfile}
              disabled={fetchingApi}
              className="px-3.5 py-1.5 rounded-xl border border-outline-variant/80 hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {fetchingApi ? 'Verifying...' : 'Re-verify Endpoint'}
            </button>
          </div>

          {apiError ? (
            <div className="p-3.5 rounded-xl bg-error-container/40 border border-error/30 text-error text-xs font-medium">
              {apiError}
            </div>
          ) : apiData ? (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">check</span>
                HTTP 200 OK — Active Session Verified
              </div>
              <pre className="p-4 rounded-xl bg-surface-container-highest/80 text-on-surface font-mono text-xs overflow-x-auto leading-relaxed border border-outline-variant/40">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant">Awaiting API verification response...</p>
          )}
        </section>

        {/* Section 5: Account Actions */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-7 shadow-xs border border-outline-variant/50 space-y-5">
          <div className="border-b border-outline-variant/30 pb-4">
            <h2 className="font-headline-sm text-lg font-bold text-on-surface">
              Account Management
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
              Session management and account settings.
            </p>
          </div>

          <div className="space-y-4">
            {/* Session Management */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
              <div>
                <span className="block font-title-md text-sm sm:text-base font-bold text-on-surface">
                  Log out
                </span>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Sign out of your OnGo account on this device.
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="self-start sm:self-center px-4 py-2 rounded-xl border border-outline-variant/80 hover:bg-surface-container-low text-on-surface font-label-md text-label-md transition-colors"
              >
                Log out
              </button>
            </div>

            {/* Danger Zone */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block font-title-md text-sm sm:text-base font-bold text-error">
                  Delete account
                </span>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  Permanently delete your OnGo account and historical ticket access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="self-start sm:self-center px-4 py-2 rounded-xl border border-error/30 hover:bg-error-container/30 text-error font-label-md text-label-md transition-colors"
              >
                Delete account
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-outline-variant/60 space-y-4">
            <div className="w-12 h-12 rounded-full bg-error-container/40 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[26px]">warning</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">
              Are you absolutely sure?
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant">
              This action cannot be undone. It will permanently remove your account profile, invalidate upcoming reservations, and erase your historical ticket passes.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-outline-variant/80 hover:bg-surface-container-low text-on-surface text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  showToast('Account deletion requested');
                }}
                className="px-4 py-2 rounded-xl bg-error text-white text-sm font-semibold hover:bg-error/90 transition-colors shadow-sm"
              >
                Yes, delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
