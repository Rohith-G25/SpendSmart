import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getTransactions, deleteTransaction } from '@/utils/storage';
import { formatCurrency, formatDate } from '@/utils/data';
import { Search, Filter, Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Transactions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currency = user?.currency || 'INR';
  const [txs, setTxs] = useState(() => getTransactions());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = txs;
    if (typeFilter) result = result.filter(t => t.type === typeFilter);
    if (search) result = result.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.name?.toLowerCase().includes(search.toLowerCase())
    );
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [txs, search, typeFilter]);

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    deleteTransaction(id);
    setTxs(getTransactions());
    toast.success('Transaction deleted');
  };

  return (
    <div className="page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">{txs.length} total</p>
        </div>
        <Link to="/add" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:brightness-110 transition-all">
          <Plus size={16} /> Add New
        </Link>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="w-full pl-10 px-4 py-3 rounded-xl text-sm font-medium bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-accent text-foreground border border-border-light hover:border-primary transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="rounded-2xl border border-border bg-card p-5 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Type</label>
            <select className="w-full px-4 py-3 rounded-xl text-sm bg-input border border-border text-foreground focus:border-primary focus:outline-none" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          {typeFilter && (
            <button onClick={() => setTypeFilter('')} className="flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-semibold text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-foreground">No transactions found</p>
            <p className="text-sm mt-1 text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(tx => (
              <div key={tx._id} className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: tx.type === 'income' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                  {tx.category?.icon || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{tx.title}</div>
                  <div className="text-xs text-muted-foreground">{tx.category?.name} · {formatDate(tx.date)}</div>
                </div>
                <span className={`text-sm font-bold font-mono ${tx.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => navigate(`/edit/${tx._id}`)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-blue transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(tx._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
