import { useState } from 'react';
import { getCategories, saveCategories } from '@/utils/storage';
import { Category } from '@/utils/data';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const EMOJI_OPTIONS = ['🍔','🚗','🛍️','🎬','💊','🏠','📚','💡','💼','💻','📈','📦','🎮','✈️','🎵','🐾','💄','⚽','🎁','🔧'];

export default function Categories() {
  const [categories, setCategories] = useState(() => getCategories());
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '📦', type: 'expense' as Category['type'], color: '#6366f1' });

  const save = (cats: Category[]) => {
    saveCategories(cats);
    setCategories(cats);
  };

  const handleAdd = () => {
    if (!form.name.trim()) { toast.error('Name required'); return; }
    if (categories.some(c => c.name.toLowerCase() === form.name.toLowerCase())) { toast.error('Already exists'); return; }
    save([...categories, { _id: `cat${Date.now()}`, ...form }]);
    setForm({ name: '', icon: '📦', type: 'expense', color: '#6366f1' });
    setAdding(false);
    toast.success('Category added');
  };

  const handleUpdate = (id: string) => {
    save(categories.map(c => c._id === id ? { ...c, ...form } : c));
    setEditing(null);
    toast.success('Updated');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    save(categories.filter(c => c._id !== id));
    toast.success('Deleted');
  };

  const startEdit = (cat: Category) => {
    setForm({ name: cat.name, icon: cat.icon, type: cat.type, color: cat.color });
    setEditing(cat._id);
    setAdding(false);
  };

  return (
    <div className="page-enter space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">{categories.length} categories</p>
        </div>
        <button onClick={() => { setAdding(true); setEditing(null); setForm({ name: '', icon: '📦', type: 'expense', color: '#6366f1' }); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:brightness-110 transition-all">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {(adding || editing) && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{editing ? 'Edit' : 'New'} Category</h3>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => setForm({ ...form, icon: e })}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border transition-all ${form.icon === e ? 'border-primary bg-primary/10' : 'border-border bg-secondary'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Name</label>
              <input className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" placeholder="Category name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Type</label>
              <select className="w-full px-4 py-3 rounded-xl text-sm bg-input border border-border text-foreground focus:border-primary focus:outline-none" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Category['type'] })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          <button onClick={() => editing ? handleUpdate(editing) : handleAdd()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:brightness-110 transition-all">
            <Check size={16} /> {editing ? 'Update' : 'Add'}
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
        {categories.map(cat => (
          <div key={cat._id} className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${cat.color}1a` }}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">{cat.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{cat.type}</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-blue transition-colors"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(cat._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
