import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const { name, email, password, confirmPassword } = formData;
    if (!name.trim() || !email.trim() || !password) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    try {
      setIsSubmitting(true);
      await register(name.trim(), email.trim(), password);
      navigate('/profile');
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container shadow-xl p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Link to="/">
                <Logo />
              </Link>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Create your account</h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Join OnGo to discover and book unforgettable events
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2 animate-in fade-in duration-150">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  required
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-container bg-surface-container-low/50 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider" htmlFor="reg-email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-container bg-surface-container-low/50 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider" htmlFor="reg-password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-surface-container bg-surface-container-low/50 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock_reset</span>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-surface-container bg-surface-container-low/50 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {formData.password && formData.confirmPassword && (
                <p className={`text-xs flex items-center gap-1 ${formData.password === formData.confirmPassword ? 'text-emerald-700' : 'text-rose-600'}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {formData.password === formData.confirmPassword ? 'check_circle' : 'cancel'}
                  </span>
                  {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-secondary-container hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-surface-container">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-container font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
