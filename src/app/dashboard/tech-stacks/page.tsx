"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { TechStack } from "@prisma/client";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function TechStacksPage() {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", iconUrl: "" });

  const fetchTechStacks = async () => {
    const res = await fetch("/api/tech-stacks");
    const data = await res.json();
    setTechStacks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTechStacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/tech-stacks/${editingId}` : "/api/tech-stacks";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success(editingId ? "Tech stack updated" : "Tech stack created");
      setFormData({ name: "", iconUrl: "" });
      setEditingId(null);
      fetchTechStacks();
    } else {
      toast.error("Failed to save tech stack");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tech stack?")) return;
    const res = await fetch(`/api/tech-stacks/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Tech stack deleted");
      fetchTechStacks();
    } else {
      toast.error("Failed to delete tech stack");
    }
  };

  const handleEdit = (stack: TechStack) => {
    setEditingId(stack.id);
    setFormData({ name: stack.name, iconUrl: stack.iconUrl || "" });
  };

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair font-bold">Tech Stacks Management</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="glass p-6 rounded-xl border border-border">
            <h3 className="font-bold mb-4">{editingId ? "Edit Tech Stack" : "New Tech Stack"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. React" required className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon URL (SVG usually)</label>
                <input
                  type="url"
                  value={formData.iconUrl}
                  onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                  placeholder="https://icon.url/react.svg"
                  className="w-full bg-surface border border-border rounded px-3 py-2 text-sm"
                />
              </div>
              <button type="submit" className="w-full bg-accent text-bg font-bold py-2 rounded hover:bg-accent-2 flex items-center justify-center gap-2">
                {editingId ? (
                  "Update"
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", iconUrl: "" });
                  }}
                  className="w-full mt-2 text-sm text-text-muted hover:text-foreground"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="md:col-span-2">
          <div className="glass rounded-xl border border-border overflow-hidden">
            {loading ? (
              <div className="p-6 text-center text-text-muted">Loading...</div>
            ) : techStacks.length === 0 ? (
              <div className="p-6 text-center text-text-muted">No tech stacks found.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    <th className="px-6 py-4 font-medium text-sm text-text-muted w-16">Icon</th>
                    <th className="px-6 py-4 font-medium text-sm text-text-muted">Name</th>
                    <th className="px-6 py-4 font-medium text-sm text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {techStacks.map((stack) => (
                    <tr key={stack.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">{stack.iconUrl ? <img src={stack.iconUrl} alt={stack.name} className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 bg-surface border border-border rounded-full" />}</td>
                      <td className="px-6 py-4 font-medium">{stack.name}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEdit(stack)} className="p-2 text-text-muted hover:text-accent transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(stack.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
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
      </div>
    </div>
  );
}
