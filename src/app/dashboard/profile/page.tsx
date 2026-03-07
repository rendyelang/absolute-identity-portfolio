"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Profile } from "@prisma/client";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) {
          setProfile(data);
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success("Profile saved successfully");
      } else {
        toast.error("Failed to save profile");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-playfair font-bold mb-8">Profile Configuration</h1>

      <form onSubmit={handleSave} className="glass p-6 rounded-xl border border-border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input name="name" value={profile.name || ""} onChange={handleChange} required className="w-full bg-surface border border-border rounded px-4 py-2" />
          </div>
          <div></div> {/* Empty div to keep grid aligned if needed, or we can just shift things */}
          <div>
            <label className="block text-sm font-medium mb-2">Title / Headline (ID)</label>
            <input name="title" value={profile.title || ""} onChange={handleChange} required className="w-full bg-surface border border-border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-accent">Title / Headline (EN)</label>
            <input name="titleEn" value={profile.titleEn || ""} onChange={handleChange} className="w-full bg-surface border border-accent/50 rounded px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bio (ID)</label>
            <textarea name="bio" value={profile.bio || ""} onChange={handleChange} required rows={4} className="w-full bg-surface border border-border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-accent">Bio (EN)</label>
            <textarea name="bioEn" value={profile.bioEn || ""} onChange={handleChange} rows={4} className="w-full bg-surface border border-accent/50 rounded px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Avatar URL (Optional)</label>
            <input name="avatarUrl" value={profile.avatarUrl || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input type="email" name="email" value={profile.email || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input name="githubUrl" value={profile.githubUrl || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input name="linkedinUrl" value={profile.linkedinUrl || ""} onChange={handleChange} className="w-full bg-surface border border-border rounded px-4 py-2" />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button type="submit" disabled={saving} className="bg-accent text-bg font-bold py-2 px-6 rounded hover:bg-accent-2 transition-colors">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
