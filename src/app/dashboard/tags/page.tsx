"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Tag } from "@prisma/client";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", color: "" });

  const fetchTags = async () => {
    const res = await fetch("/api/tags");
    const data = await res.json();
    setTags(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/tags/${editingId}` : "/api/tags";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success(editingId ? "Tag updated" : "Tag created");
      setFormData({ name: "", color: "" });
      setEditingId(null);
      fetchTags();
    } else {
      toast.error("Failed to save tag");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Tag deleted");
      fetchTags();
    } else {
      toast.error("Failed to delete tag");
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setFormData({ name: tag.name, color: tag.color || "" });
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair font-bold">Tags Management</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="glass p-6 rounded-xl border border-border">
            <h3 className="font-bold mb-4">{editingId ? "Edit Tag" : "New Tag"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Web" required className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
              </div>
              <button type="submit" className="w-full bg-accent text-bg font-bold py-2 rounded hover:bg-accent-2 flex items-center justify-center gap-2">
                {editingId ? (
                  "Update Tag"
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add Tag
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", color: "" });
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
            ) : tags.length === 0 ? (
              <div className="p-6 text-center text-text-muted">No tags found.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    <th className="px-6 py-4 font-medium text-sm text-text-muted">Name</th>
                    <th className="px-6 py-4 font-medium text-sm text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    <tr key={tag.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-surface border border-border rounded-full text-sm font-medium">{tag.name}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEdit(tag)} className="p-2 text-text-muted hover:text-accent transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(tag.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
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
