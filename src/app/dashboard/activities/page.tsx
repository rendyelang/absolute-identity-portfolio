"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Activity } from "@prisma/client";
import { Trash2, Edit2, Plus, Trophy, Star } from "lucide-react";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    organizer: "",
    type: "bootcamp",
    logoUrl: "",
    date: "",
    endDate: "",
    achievement: "",
    achievementEn: "",
    description: "",
    descriptionEn: "",
    certificateUrl: "",
    order: 0,
  });

  const fetchActivities = async () => {
    const res = await fetch("/api/activities");
    const data = await res.json();
    setActivities(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/activities/${editingId}` : "/api/activities";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success(editingId ? "Activity updated" : "Activity created");
      resetForm();
      fetchActivities();
    } else {
      toast.error("Failed to save activity");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this activity?")) return;
    const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Activity deleted");
      fetchActivities();
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (act: Activity) => {
    setEditingId(act.id);
    setFormData({
      title: act.title,
      titleEn: act.titleEn || "",
      organizer: act.organizer,
      type: act.type,
      logoUrl: act.logoUrl || "",
      date: act.date,
      endDate: act.endDate || "",
      achievement: act.achievement || "",
      achievementEn: act.achievementEn || "",
      description: act.description,
      descriptionEn: act.descriptionEn || "",
      certificateUrl: act.certificateUrl || "",
      order: act.order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      title: "", titleEn: "", organizer: "", type: "bootcamp", logoUrl: "",
      date: "", endDate: "", achievement: "", achievementEn: "",
      description: "", descriptionEn: "", certificateUrl: "", order: 0,
    });
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair font-bold flex items-center gap-3">
          <Trophy className="w-8 h-8 text-accent" /> Activities
        </h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-accent text-bg px-4 py-2 rounded font-bold hover:bg-accent-2 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Activity
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-xl border border-border mb-8 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="text-xl font-bold">{editingId ? "Edit Activity" : "New Activity"}</h3>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-foreground">
              Cancel
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title (ID)</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="e.g., Bangkit Academy 2024" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-accent">Title (EN)</label>
              <input type="text" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="w-full bg-surface border border-accent/50 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Organizer</label>
              <input type="text" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="e.g., Google, GoTo, Traveloka" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2">
                <option value="bootcamp">Bootcamp / Training</option>
                <option value="competition">Competition</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="e.g., Feb 2024" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date (optional)</label>
              <input type="text" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="e.g., Jun 2024" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Achievement (ID, optional)</label>
              <input type="text" value={formData.achievement} onChange={(e) => setFormData({ ...formData, achievement: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="e.g., Juara 2 Nasional" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-accent">Achievement (EN, optional)</label>
              <input type="text" value={formData.achievementEn} onChange={(e) => setFormData({ ...formData, achievementEn: e.target.value })} className="w-full bg-surface border border-accent/50 rounded px-3 py-2" placeholder="e.g., 2nd Place National" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (ID)</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-accent">Description (EN)</label>
              <textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} rows={4} className="w-full bg-surface border border-accent/50 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Logo URL (optional)</label>
              <input type="url" value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="https://" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Certificate URL (optional)</label>
              <input type="url" value={formData.certificateUrl} onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="https://" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-accent text-bg font-bold py-2 px-6 rounded hover:bg-accent-2">
              {editingId ? "Update" : "Save"} Activity
            </button>
          </div>
        </form>
      )}

      <div className="glass rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-text-muted">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-text-muted">No activities found. Add one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="px-6 py-4 font-medium text-sm text-text-muted">Title & Organizer</th>
                  <th className="px-6 py-4 font-medium text-sm text-text-muted">Type</th>
                  <th className="px-6 py-4 font-medium text-sm text-text-muted">Dates</th>
                  <th className="px-6 py-4 font-medium text-sm text-text-muted">Achievement</th>
                  <th className="px-6 py-4 font-medium text-sm text-text-muted">Order</th>
                  <th className="px-6 py-4 font-medium text-sm text-text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr key={act.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold">{act.title}</p>
                      <p className="text-sm text-text-muted">{act.organizer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                        act.type === "competition"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-accent/10 text-accent border-accent/30"
                      }`}>
                        {act.type === "competition" ? "Competition" : "Bootcamp"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {act.date}{act.endDate ? ` — ${act.endDate}` : ""}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {act.achievement ? (
                        <span className="inline-flex items-center gap-1 text-accent text-xs font-bold">
                          <Star className="w-3 h-3" /> {act.achievement}
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{act.order}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(act)} className="p-2 text-text-muted hover:text-accent transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(act.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
