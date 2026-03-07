"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Experience } from "@prisma/client";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    descriptionEn: "",
    order: 0,
  });

  const fetchExperiences = async () => {
    const res = await fetch("/api/experience");
    const data = await res.json();
    setExperiences(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/experience/${editingId}` : "/api/experience";
    const method = editingId ? "PUT" : "POST";

    const payload = { ...formData };
    if (payload.current) payload.endDate = ""; // Clear endDate if current

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editingId ? "Experience updated" : "Experience created");
      resetForm();
      fetchExperiences();
    } else {
      toast.error("Failed to save experience");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Experience deleted");
      fetchExperiences();
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      titleEn: exp.titleEn || "",
      company: exp.company,
      location: exp.location || "",
      startDate: new Date(exp.startDate).toISOString().split("T")[0],
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "",
      current: exp.current,
      description: exp.description,
      descriptionEn: exp.descriptionEn || "",
      order: exp.order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({ title: "", titleEn: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "", descriptionEn: "", order: 0 });
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair font-bold">Experience Timeline</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-accent text-bg px-4 py-2 rounded font-bold hover:bg-accent-2 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-xl border border-border mb-8 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="text-xl font-bold">{editingId ? "Edit Experience" : "New Experience"}</h3>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-foreground">
              Cancel
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title (ID)</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-accent">Job Title (EN)</label>
              <input type="text" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="w-full bg-surface border border-accent/50 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div className={`transition-opacity ${formData.current ? "opacity-50 pointer-events-none" : ""}`}>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required={!formData.current} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="current" checked={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.checked })} className="w-4 h-4 rounded border-border bg-surface text-accent" />
              <label htmlFor="current" className="text-sm font-medium">
                I currently work here
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (ID)</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-accent">Description (EN)</label>
              <textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} rows={4} className="w-full bg-surface border border-accent/50 rounded px-3 py-2" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-accent text-bg font-bold py-2 px-6 rounded hover:bg-accent-2">
              {editingId ? "Update" : "Save"} Experience
            </button>
          </div>
        </form>
      )}

      <div className="glass rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-text-muted">Loading...</div>
        ) : experiences.length === 0 ? (
          <div className="p-6 text-center text-text-muted">No experiences found. Add one above.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Role & Company</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Dates</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Order</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{exp.title}</p>
                    <p className="text-sm text-text-muted">{exp.company}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? "Present" : exp.endDate && new Date(exp.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{exp.order}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(exp)} className="p-2 text-text-muted hover:text-accent transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(exp.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
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
