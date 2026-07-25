"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Mail, Trash2, Download } from "lucide-react";
import { listSubscribers, addSubscriber, deleteSubscriber } from "@/app/admin/newsletter/actions";

interface Subscriber {
  email: string;
  status: string;
}

export default function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setSubmitting(true);
    try {
      await addSubscriber(newEmail);
      toast.success("Subscriber added successfully");
      setNewEmail("");
      setIsAddDialogOpen(false);
      fetchSubscribers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add subscriber");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEmail) return;

    try {
      await deleteSubscriber(deletingEmail);
      toast.success("Subscriber deleted successfully");
      fetchSubscribers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete subscriber");
    } finally {
      setDeletingEmail(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = useCallback((email: string) => {
    setDeletingEmail(email);
    setIsDeleteDialogOpen(true);
  }, []);

  const exportSubscribers = useCallback(() => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Email,Status", ...subscribers.map((sub) => `${sub.email},${sub.status}`)].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Subscribers exported successfully");
  }, [subscribers]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-gray-600">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-primary-dark sm:text-xl">
            Subscriber Management
          </h2>
          <p className="text-sm text-gray-500">Total {subscribers.length} subscribers</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            onClick={exportSubscribers}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-white sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="sm:hidden">Export</span>
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="w-full rounded-full bg-primary px-6 font-semibold hover:bg-primary-dark sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader className="border-b border-gray-200 pb-4">
                <DialogTitle className="text-primary-dark">Add New Subscriber</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubscriber} className="space-y-5 pt-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="mt-1.5"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-dark py-3 font-semibold"
                >
                  {submitting ? "Adding..." : "Add Subscriber"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {subscribers.map((subscriber) => (
          <Card
            key={subscriber.email}
            className="rounded-2xl border-gray-200 shadow-lg transition-shadow hover:shadow-xl"
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary sm:h-10 sm:w-10">
                    <Mail className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-gray-800 sm:text-base">
                      {subscriber.email}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${
                          subscriber.status === "subscribed" ? "bg-secondary" : "bg-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          subscriber.status === "subscribed" ? "text-primary-dark" : "text-gray-500"
                        }`}
                      >
                        {subscriber.status === "subscribed" ? "Subscribed" : "Unsubscribed"}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteDialog(subscriber.email)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subscribers.length === 0 && (
        <div className="py-8 text-center sm:py-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cream sm:h-20 sm:w-20">
            <Mail className="h-8 w-8 text-secondary sm:h-10 sm:w-10" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-primary-dark sm:text-xl">
            No subscribers yet
          </h3>
          <p className="mb-6 text-sm text-gray-500 sm:text-base">
            Add your first subscriber to get started
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full rounded-full bg-primary px-6 font-semibold hover:bg-primary-dark sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Subscriber
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="border-b border-gray-200 pb-3">
            <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-sm text-gray-700 sm:text-base">
            Are you sure you want to remove <strong className="break-words">{deletingEmail}</strong>{" "}
            from subscribers?
          </p>
          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto"
            >
              Remove Subscriber
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
