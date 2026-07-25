"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Send, Pencil, Trash2, Eye } from "lucide-react";
import {
  listNewsletters,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  sendNewsletter
} from "@/app/admin/newsletter/actions";

const TinyMCEEditor = dynamic(() => import("@/components/admin/blog/TinyMCEEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-lg border border-gray-300 p-4 text-sm text-gray-500">
      Loading editor...
    </div>
  ),
});

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: string;
  sentAt?: string;
  createdAt: string;
}

const EMPTY_FORM = { title: "", subject: "", content: "" };

export default function NewsletterManagement() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewNewsletter, setPreviewNewsletter] = useState<Newsletter | null>(null);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchNewsletters = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listNewsletters();
      setNewsletters(data);
    } catch (error) {
      console.error("Failed to fetch newsletters:", error);
      toast.error("Failed to fetch newsletters");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletters();
  }, [fetchNewsletters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingNewsletter) {
        await updateNewsletter(editingNewsletter.id, formData);
      } else {
        await createNewsletter(formData);
      }

      toast.success(`Newsletter ${editingNewsletter ? "updated" : "created"} successfully`);
      fetchNewsletters();
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingNewsletter(null);
      setFormData(EMPTY_FORM);
    } catch (error) {
      console.error("Failed to save newsletter:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save newsletter");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSend = async (id: string) => {
    try {
      setSendingId(id);
      const result: any = await sendNewsletter(id);

      toast.success(
        result.failed > 0
          ? `Sent to ${result.sent}/${result.total} subscribers (${result.failed} failed)`
          : `Sent to all ${result.sent} subscribers`,
      );
      fetchNewsletters();
    } catch (error) {
      console.error("Failed to send newsletter:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send newsletter");
    } finally {
      setSendingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteNewsletter(deletingId);
      toast.success("Newsletter deleted successfully");
      fetchNewsletters();
    } catch (error) {
      console.error("Failed to delete newsletter:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete newsletter");
    } finally {
      setDeletingId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = useCallback((id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((newsletter: Newsletter) => {
    setEditingNewsletter(newsletter);
    setFormData({
      title: newsletter.title,
      subject: newsletter.subject,
      content: newsletter.content,
    });
    setIsEditDialogOpen(true);
  }, []);

  const openPreviewDialog = useCallback((newsletter: Newsletter) => {
    setPreviewNewsletter(newsletter);
    setIsPreviewOpen(true);
  }, []);

  const resetForm = useCallback(() => {
    setEditingNewsletter(null);
    setFormData(EMPTY_FORM);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-gray-600">Loading newsletters...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsCreateDialogOpen(true);
              }}
              className="rounded-full bg-primary px-6 font-semibold hover:bg-primary-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b border-gray-200 pb-4">
              <DialogTitle className="text-primary-dark">Create New Newsletter</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <div className="mt-1.5 overflow-hidden rounded-lg border border-gray-300">
                  <TinyMCEEditor
                    placeholder="Enter newsletter content..."
                    initialValue={formData.content}
                    onContentChange={(content) => setFormData({ ...formData, content })}
                    height="300px"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-dark py-3 font-semibold"
              >
                {submitting ? "Creating..." : "Create Newsletter"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsletters.map((newsletter) => (
          <Card
            key={newsletter.id}
            className="overflow-hidden rounded-2xl border-gray-200 shadow-lg transition-shadow hover:shadow-xl"
          >
            <CardHeader className="border-b border-gray-200 bg-primary/5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <CardTitle className="truncate text-lg text-primary-dark">
                    {newsletter.title}
                  </CardTitle>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{newsletter.subject}</p>
                </div>
                <div
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    newsletter.status === "sent"
                      ? "border-secondary/30 bg-secondary/10 text-primary-dark"
                      : "border-gold/40 bg-gold/10 text-primary-dark"
                  }`}
                >
                  {newsletter.status === "sent" ? "Sent" : "Draft"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div
                className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600"
                dangerouslySetInnerHTML={{ __html: newsletter.content }}
              />
              <div className="space-y-1 border-t border-gray-200 pt-3 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created:</span>
                  <span>{new Date(newsletter.createdAt).toLocaleDateString()}</span>
                </div>
                {newsletter.sentAt && (
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="font-bold">Sent:</span>
                    <span>{new Date(newsletter.sentAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => openPreviewDialog(newsletter)}>
                  <Eye className="mr-1 h-4 w-4" />
                  Preview
                </Button>
                {newsletter.status !== "sent" && (
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(newsletter)}>
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                )}
                {newsletter.status !== "sent" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={sendingId === newsletter.id}
                    onClick={() => handleSend(newsletter.id)}
                    className="border-secondary text-primary-dark hover:bg-secondary/10"
                  >
                    <Send className="mr-1 h-4 w-4" />
                    {sendingId === newsletter.id ? "Sending..." : "Send"}
                  </Button>
                )}
                {newsletter.status !== "sent" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(newsletter.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {newsletters.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-cream">
            <Send className="h-10 w-10 text-secondary" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-primary-dark">No newsletters yet</h3>
          <p className="mb-6 text-gray-500">Create your first newsletter to get started</p>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
            className="rounded-full bg-primary px-6 font-semibold hover:bg-primary-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Newsletter
          </Button>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-primary-dark">Preview Newsletter</DialogTitle>
          </DialogHeader>
          {previewNewsletter && (
            <div className="space-y-4 pt-4">
              <div className="rounded-xl border border-gray-200 bg-primary/5 p-4">
                <h2 className="mb-2 text-xl font-bold text-primary-dark">
                  {previewNewsletter.title}
                </h2>
                <p className="font-medium text-gray-500">{previewNewsletter.subject}</p>
              </div>
              <div
                className="rounded-xl border border-gray-200 bg-cream p-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: previewNewsletter.content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-primary-dark">Edit Newsletter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <div className="mt-1.5 overflow-hidden rounded-lg border border-gray-300">
                <TinyMCEEditor
                  placeholder="Enter newsletter content..."
                  initialValue={formData.content}
                  onContentChange={(content) => setFormData({ ...formData, content })}
                  height="300px"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-dark py-3 font-semibold"
            >
              {submitting ? "Updating..." : "Update Newsletter"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="border-b border-gray-200 pb-3">
            <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-gray-700">
            Are you sure you want to delete this newsletter? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
