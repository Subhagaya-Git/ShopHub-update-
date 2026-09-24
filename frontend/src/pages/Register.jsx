import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, Input, Button, Icon } from '../components/ui';

export default function Register() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      push('Account created successfully!');
      navigate('/');
    } catch (err) {
      push(err.message || 'Unable to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/25">
          <Icon name="user" className="h-7 w-7" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Join ShopHub</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create account</h1>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Full name"
            icon="user"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />
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
              placeholder="At least 6 characters"
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
          <Button type="submit" fullWidth size="lg" loading={loading}>Create account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Have an account? <Link to="/login" className="font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
