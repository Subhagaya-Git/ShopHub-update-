import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { useToast } from '../../context/ToastContext';
import { Card, Input, Select, Textarea, Button, Badge, Icon, Modal, Skeleton, EmptyState, ProductImage } from '../../components/ui';

const empty = { name: '', description: '', price: '', stock: '', category: '', image_url: '' };

export default function AdminProducts() {
  const { push } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getProducts({ limit: 100 }).then((res) => setProducts(res.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setEditing('new'); setForm(empty); setErrors({}); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, image_url: p.image_url || '' });
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.category.trim()) e.category = 'Category is required';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Valid stock required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.image_url.trim()) e.image_url = 'Image URL is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editing === 'new') {
        await createProduct(payload);
        push('Product created successfully!');
      } else {
        await updateProduct(editing, payload);
        push('Product updated successfully!');
      }
      setEditing(null);
      load();
    } catch (err) {
      push(err.message || 'Unable to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(deleteTarget._id);
      push('Product deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      push(err.message || 'Unable to delete product', 'error');
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filteredProducts = products
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ column }) => (
    <Icon name={sortKey === column ? (sortDir === 'asc' ? 'chevron-up' : 'chevron-down') : 'sort'} className={`h-3.5 w-3.5 ${sortKey === column ? 'text-brand-600' : 'text-slate-300'}`} />
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Catalog management</span>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Products</h1>
        </div>
        <Button variant="primary" icon="plus" onClick={openNew}>Add product</Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Badge variant="default">{filteredProducts.length} products</Badge>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card><EmptyState icon="package" title="No products found" description="Try a different search or add a new product." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
           <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-3"><button onClick={() => handleSort('name')} className="flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-slate-700">Name <SortIcon column="name" /></button></th>
                  <th className="p-3"><button onClick={() => handleSort('category')} className="flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-slate-700">Category <SortIcon column="category" /></button></th>
                  <th className="p-3"><button onClick={() => handleSort('price')} className="flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-slate-700">Price <SortIcon column="price" /></button></th><th className="p-3"><button onClick={() => handleSort('stock')} className="flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-slate-700">Stock <SortIcon column="stock" /></button></th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="border-b border-slate-50 transition hover:bg-slate-50/60 dark:border-slate-800/50 dark:hover:bg-slate-800/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        {p.image_url && <ProductImage src={p.image_url} alt="" className="h-9 w-9 rounded-lg object-cover" rounded="rounded-lg" />}
                        <span className="font-medium text-slate-900 dark:text-slate-100">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3"><Badge variant="default" size="sm">{p.category}</Badge></td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">${p.price.toFixed(2)}</td>
                    <td className="p-3">
                      {p.stock <= 0 ? <Badge variant="danger" size="sm">Out of stock</Badge>
                        : p.stock < 5 ? <Badge variant="warning" size="sm">{p.stock} left</Badge>
                        : <Badge variant="success" size="sm">{p.stock}</Badge>}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30" aria-label={`Edit ${p.name}`}>
                          <Icon name="edit" className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-900/30" aria-label={`Delete ${p.name}`}>
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New product' : 'Edit product'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="primary" onClick={submit} loading={saving} icon="check">Save product</Button>
          </div>
        }
      >
        <div className="space-y-4">
          {form.image_url && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <ProductImage src={form.image_url} alt="Preview" className="h-16 w-16 rounded-lg object-cover" rounded="rounded-lg" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Image preview</p>
                <p className="text-xs text-slate-400 truncate">{form.image_url}</p>
              </div>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Name" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input label="Category" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} error={errors.category} />
            <Input label="Price" type="number" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} error={errors.price} icon="dollar" />
            <Input label="Stock" type="number" placeholder="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} error={errors.stock} icon="package" />
          </div>
          <Textarea label="Description" rows={3} placeholder="Product description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={errors.description} />
          <Input label="Image URL" placeholder="https://..." value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} error={errors.image_url} icon="image" required />
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete product"
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete} icon="trash">Delete</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
