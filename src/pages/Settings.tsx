import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Save, User } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, currency });
    toast.success('Settings saved');
  };

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b border-border">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-foreground bg-gradient-to-br from-primary to-green-600">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{user?.name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Full Name</label>
          <input className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Currency</label>
          <select className="w-full px-4 py-3 rounded-xl text-sm bg-input border border-border text-foreground focus:border-primary focus:outline-none" value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="INR">₹ INR - Indian Rupee</option>
            <option value="USD">$ USD - US Dollar</option>
            <option value="EUR">€ EUR - Euro</option>
            <option value="GBP">£ GBP - British Pound</option>
          </select>
        </div>

        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:brightness-110 transition-all">
          <Save size={16} /> Save Changes
        </button>
      </form>

      <div className="rounded-2xl border border-destructive/30 bg-card p-6">
        <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">Sign out from your account</p>
        <button onClick={logout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-destructive text-destructive-foreground hover:brightness-110 transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
}
