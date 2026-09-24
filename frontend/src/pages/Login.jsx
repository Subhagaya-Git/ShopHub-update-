import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, Input, Button, Icon } from '../components/ui';

export default function Login() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      push('Welcome back!');
      const from = location.state?.from?.pathname || (data.role === 'admin' ? '/admin' : '/');
      navigate(from, { replace: true });
    } catch (err) {
      push(err.message || 'Unable to sign in', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25">
          <Icon name="lock" className="h-7 w-7" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Welcome back</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Sign in</h1>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            icon="mail"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            required
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon="lock"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[2.125rem] text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} className="h-4 w-4" />
            </button>
          </div>
          <Button type="submit" fullWidth size="lg" loading={loading}>Sign in</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No account? <Link to="/register" className="font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400">Register</Link>
        </p>
      </Card>
    </div>
  );
}
