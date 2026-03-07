"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import { Certificate } from "@prisma/client";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    issuer: "",
    date: "",
    description: "",
    descriptionEn: "",
    imageUrl: "",
    credentialUrl: "",
    order: 0,
  });

  const fetchCertificates = async () => {
    const res = await fetch("/api/certificates");
    const data = await res.json();
    setCertificates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/certificates/${editingId}` : "/api/certificates";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success(editingId ? "Certificate updated" : "Certificate created");
      resetForm();
      fetchCertificates();
    } else {
      toast.error("Failed to save certificate");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certificate?")) return;
    const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Certificate deleted");
      fetchCertificates();
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      titleEn: cert.titleEn || "",
      issuer: cert.issuer,
      date: cert.date,
      description: cert.description || "",
      descriptionEn: cert.descriptionEn || "",
      imageUrl: cert.imageUrl,
      credentialUrl: cert.credentialUrl || "",
      order: cert.order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({ title: "", titleEn: "", issuer: "", date: "", description: "", descriptionEn: "", imageUrl: "", credentialUrl: "", order: 0 });
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair font-bold">Certificates Management</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-accent text-bg px-4 py-2 rounded font-bold hover:bg-accent-2 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Certificate
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-xl border border-border mb-8 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="text-xl font-bold">{editingId ? "Edit Certificate" : "New Certificate"}</h3>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Certificate Title (ID)</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="e.g. AWS Certified Solutions Architect" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Certificate Title (EN)</label>
              <input type="text" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="e.g. AWS Certified Solutions Architect" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Issuer / Organization</label>
              <input type="text" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="e.g. Amazon Web Services" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date Issued</label>
              <input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="e.g. Oct 2023" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Image URL (Required)</label>
              <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="https://" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Credential URL (Optional)</label>
              <input type="url" value={formData.credentialUrl} onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="https://www.credly.com/..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (ID)</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="Penjelasan singkat sertifikasi..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (EN)</label>
              <textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} rows={3} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="Brief details about the certification..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Display Order (Lower comes first)</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} required className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button type="submit" className="bg-accent text-bg font-bold py-2 px-8 rounded hover:bg-accent-2">
              {editingId ? "Update" : "Save"} Certificate
            </button>
          </div>
        </form>
      )}

      <div className="glass rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-text-muted">Loading certificates...</div>
        ) : certificates.length === 0 ? (
          <div className="p-6 text-center text-text-muted">No certificates found. Add one above.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-6 py-4 font-medium text-sm text-text-muted w-32">Image</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Details</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Order</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-24 h-16 bg-surface border border-border rounded overflow-hidden">
                      {cert.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">No IMG</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold flex items-center gap-2">
                      {cert.title}
                    </p>
                    <p className="text-sm text-text-muted">{cert.issuer} • {cert.date}</p>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline mt-1 inline-block">
                        View Credential ↗
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{cert.order}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(cert)} className="p-2 text-text-muted hover:text-accent transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
