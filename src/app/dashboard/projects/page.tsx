"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Prisma } from "@prisma/client";
import { Trash2, Edit2, Plus, X } from "lucide-react";

type ProjectWithRelations = Prisma.ProjectGetPayload<{ include: { tags: true; techStacks: true } }>;
type Tag = Prisma.TagGetPayload<{}>;
type TechStack = Prisma.TechStackGetPayload<{}>;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableTechStacks, setAvailableTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    longDesc: "",
    longDescEn: "",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "",
    featured: false,
    order: 0,
    tags: [] as string[], // IDs
    techStacks: [] as string[], // IDs
  });

  const fetchData = async () => {
    const [pRes, tRes, tsRes] = await Promise.all([fetch("/api/projects"), fetch("/api/tags"), fetch("/api/tech-stacks")]);
    const [pData, tData, tsData] = await Promise.all([pRes.json(), tRes.json(), tsRes.json()]);
    setProjects(pData);
    setAvailableTags(tData);
    setAvailableTechStacks(tsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success(editingId ? "Project updated" : "Project created");
      resetForm();
      fetchData();
    } else {
      toast.error("Failed to save project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Project deleted");
      fetchData();
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (project: ProjectWithRelations) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      titleEn: project.titleEn || "",
      description: project.description,
      descriptionEn: project.descriptionEn || "",
      longDesc: project.longDesc || "",
      longDescEn: project.longDescEn || "",
      imageUrl: project.imageUrl || "",
      liveUrl: project.liveUrl || "",
      repoUrl: project.repoUrl || "",
      featured: project.featured,
      order: project.order,
      tags: project.tags.map((t: Tag) => t.id),
      techStacks: project.techStacks.map((t: TechStack) => t.id),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({ title: "", titleEn: "", description: "", descriptionEn: "", longDesc: "", longDescEn: "", imageUrl: "", liveUrl: "", repoUrl: "", featured: false, order: 0, tags: [], techStacks: [] });
  };

  const toggleArrayItem = (array: string[], id: string) => {
    return array.includes(id) ? array.filter((x) => x !== id) : [...array, id];
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair font-bold">Projects Management</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-accent text-bg px-4 py-2 rounded font-bold hover:bg-accent-2 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-xl border border-border mb-8 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="text-xl font-bold">{editingId ? "Edit Project" : "New Project"}</h3>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title (ID)</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-accent">Title (EN)</label>
              <input type="text" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="w-full bg-surface border border-accent/50 rounded px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Short Description (Card summary) - ID</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={2} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-accent">Short Description (Card summary) - EN</label>
              <textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} rows={2} className="w-full bg-surface border border-accent/50 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preview Image URL</label>
              <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" placeholder="https://" />
            </div>
            <div></div> {/* Empty div to keep grid aligned */}
            <div>
              <label className="block text-sm font-medium mb-1">Live URL (Optional)</label>
              <input type="url" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Repository URL (Optional)</label>
              <input type="url" value={formData.repoUrl} onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })} className="w-full bg-surface border border-border rounded px-3 py-2" />
            </div>
            <div className="md:col-span-2 p-4 border border-border rounded bg-surface/50">
              <label className="block text-sm font-bold mb-3">Project Categories (Tags)</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, tags: toggleArrayItem(formData.tags, tag.id) })}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors flex items-center gap-2 ${formData.tags.includes(tag.id) ? "bg-accent border-accent text-bg font-bold" : "border-border text-text-muted hover:border-accent"}`}
                  >
                    {tag.color && (
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    )}
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 p-4 border border-border rounded bg-surface/50">
              <label className="block text-sm font-bold mb-3">Tech Stacks</label>
              <div className="flex flex-wrap gap-2">
                {availableTechStacks.map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, techStacks: toggleArrayItem(formData.techStacks, tech.id) })}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.techStacks.includes(tech.id) ? "bg-accent border-accent text-bg font-bold" : "border-border text-text-muted hover:border-accent"}`}
                  >
                    {tech.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 rounded border-border bg-surface text-accent" />
                <span className="text-sm font-medium">Featured Project</span>
              </label>
              <div>
                <label className="flex items-center gap-2">
                  <span className="text-sm font-medium">Display Priority</span>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-20 bg-surface border border-border rounded px-2 py-1 outline-none focus:border-accent"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button type="submit" className="bg-accent text-bg font-bold py-2 px-8 rounded hover:bg-accent-2">
              {editingId ? "Update" : "Save"} Project
            </button>
          </div>
        </form>
      )}

      <div className="glass rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-text-muted">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-6 text-center text-text-muted">No projects found. Share your work with the world.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-6 py-4 font-medium text-sm text-text-muted w-20">Preview</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Project Details</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted">Tags & Tech</th>
                <th className="px-6 py-4 font-medium text-sm text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 bg-surface border border-border rounded overflow-hidden">{project.imageUrl && <img src={project.imageUrl} className="w-full h-full object-cover" alt="" />}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold flex items-center gap-2">
                      {project.title}
                      {project.featured && <span className="text-[10px] uppercase bg-accent/20 text-accent px-2 py-0.5 rounded-full">Featured</span>}
                    </p>
                    <p className="text-sm text-text-muted line-clamp-1">{project.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {project.tags.map((t: Tag) => (
                        <span key={t.id} className="text-xs px-1.5 py-0.5 bg-surface border border-border rounded flex items-center gap-1">
                          {t.color && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }}></span>}
                          {t.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.techStacks.map((t: TechStack) => (
                        <span key={t.id} className="text-[10px] text-text-muted px-1">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(project)} className="p-2 text-text-muted hover:text-accent transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
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
