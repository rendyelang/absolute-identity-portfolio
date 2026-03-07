"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Edit2, Plus } from "lucide-react";

type Education = {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string | null;
  gpa: string | null;
  logoUrl: string | null;
  order: number;
};

export default function EducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
    gpa: "",
    logoUrl: "",
    order: 0,
  });

  const fetchEducation = async () => {
    const res = await fetch("/api/education");
    const data = await res.json();
    setEducationList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/education/${editingId}` : "/api/education";
    const method = editingId ? "PUT" : "POST";

    const payload = { ...formData };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editingId ? "Education updated" : "Education created");
      resetForm();
      fetchEducation();
    } else {
      toast.error("Failed to save education");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this education record?")) return;
    const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Education deleted");
      fetchEducation();
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate || "",
      gpa: edu.gpa || "",
      logoUrl: edu.logoUrl || "",
      order: edu.order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({ institution: "", degree: "", startDate: "", endDate: "", gpa: "", logoUrl: "", order: 0 });
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair font-bold">Education Timeline</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-accent text-bg px-4 py-2 rounded font-bold hover:bg-accent-2 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Education
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-xl border border-border mb-8 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="text-xl font-bold">{editingId ? "Edit Education" : "New Education"}</h3>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-foreground">
              Cancel
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <input type="text" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="Universitas Nusa Putra" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Degree / Major</label>
              <input type="text" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="S1 Teknik Informatika" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Year / Date</label>
              <input type="text" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="2023" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Year / Date</label>
              <input type="text" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="Sekarang" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">GPA (Optional)</label>
              <input type="text" value={formData.gpa} onChange={(e) => setFormData({ ...formData, gpa: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="3.94" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Logo URL (Optional)</label>
              <input type="url" value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="https://" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-accent text-bg font-bold py-2 px-6 rounded hover:bg-accent-2">
              {editingId ? "Update" : "Save"} Education
            </button>
          </div>
        </form>
      )}

      <div className="glass rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-text-muted">Loading...</div>
        ) : educationList.length === 0 ? (
          <div className="p-6 text-center text-text-muted">No education records found. Add one above.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-6 py-4 font-medium text-sm text-text-muted w-16">Logo</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Institution & Degree</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Dates & GPA</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Order</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {educationList.map((edu) => (
                <tr key={edu.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-surface rounded-full overflow-hidden border border-border flex items-center justify-center">
                      {edu.logoUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={edu.logoUrl} alt={edu.institution} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-text-muted text-xs">No</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold">{edu.institution}</p>
                    <p className="text-sm text-text-muted">{edu.degree}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <p>{edu.startDate} - {edu.endDate || "Present"}</p>
                    {edu.gpa && <p className="text-accent text-xs">GPA: {edu.gpa}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm">{edu.order}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(edu)} className="p-2 text-text-muted hover:text-accent transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(edu.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
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
