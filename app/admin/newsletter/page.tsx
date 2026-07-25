"use client";

export const dynamic = "force-dynamic";

import { useState, useCallback, useEffect } from "react";
import NewsletterManagement from "@/components/admin/newsletter/NewsletterManager";
import SubscriberManagement from "@/components/admin/newsletter/SubscriberManagement";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Users,
  Send,
  Loader2,
  Sparkles,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { listNewsletters, listSubscribers } from "@/app/admin/newsletter/actions";

interface DashboardStats {
  newsletters: number;
  sent: number;
  drafts: number;
  subscribers: number;
}

const EMPTY_STATS: DashboardStats = {
  newsletters: 0,
  sent: 0,
  drafts: 0,
  subscribers: 0,
};

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState<"newsletters" | "subscribers">(
    "newsletters",
  );
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(EMPTY_STATS);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setStatsError(null);

    try {
      const [newsletters, subscribers] = await Promise.all([listNewsletters(), listSubscribers()]);

      const sent = newsletters.filter((newsletter: any) => newsletter.status === "sent").length;

      setDashboardStats({
        newsletters: newsletters.length,
        sent,
        drafts: newsletters.length - sent,
        subscribers: subscribers.filter(
          (subscriber: any) => subscriber.status === "subscribed",
        ).length,
      });
    } catch (error) {
      console.error("Failed to load newsletter statistics:", error);
      setStatsError("Statistics are temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTabChange = useCallback(
    (tab: "newsletters" | "subscribers") => {
      if (tab === activeTab) return;

      setTabLoading(true);
      setTimeout(() => {
        setActiveTab(tab);
        setTabLoading(false);
      }, 300);
    },
    [activeTab],
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const stats = [
    {
      label: "Total newsletters",
      value: dashboardStats.newsletters,
      detail: "All campaigns",
      icon: Mail,
      color: "from-blue-500 to-blue-600",
      progress: 100,
    },
    {
      label: "Active subscribers",
      value: dashboardStats.subscribers,
      detail: "Ready to receive email",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      progress: dashboardStats.subscribers > 0 ? 100 : 0,
    },
    {
      label: "Sent campaigns",
      value: dashboardStats.sent,
      detail: "Successfully dispatched",
      icon: CheckCircle2,
      color: "from-emerald-500 to-emerald-600",
      progress:
        dashboardStats.newsletters > 0
          ? (dashboardStats.sent / dashboardStats.newsletters) * 100
          : 0,
    },
    {
      label: "Draft campaigns",
      value: dashboardStats.drafts,
      detail: "Waiting to be sent",
      icon: FileText,
      color: "from-amber-500 to-orange-500",
      progress:
        dashboardStats.newsletters > 0
          ? (dashboardStats.drafts / dashboardStats.newsletters) * 100
          : 0,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-8">
        <div>
          {/* Header Skeleton */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 p-8 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-lg w-64 mb-3"></div>
            <div className="h-5 bg-slate-200 rounded-lg w-96"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-8 bg-slate-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
            <div className="flex space-x-2">
              {Array.from({ length: 2 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 bg-slate-200 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 sm:p-8">
      <div className="p-4">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 mb-8 shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/60 text-sm font-medium tracking-wider uppercase">
                  Communication Hub
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                Email Management
              </h1>
              <p className="text-slate-300 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Create, manage, and analyze your email campaigns
              </p>
            </div>

            {/* Quick action indicator */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-slate-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">JD</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-slate-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">MK</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-slate-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">+3</span>
                </div>
              </div>
              <span className="text-white/80 text-sm font-medium">
                Active team
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {statsError && (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {statsError}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-slate-500">{stat.detail}</p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shadow-opacity-20 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Decorative progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 rounded-b-2xl overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-1000`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Tab Navigation */}
        <Card className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-sm mb-8">
          <CardContent className="p-2">
            <div className="flex space-x-2 bg-slate-100/80 rounded-xl p-1">
              <button
                onClick={() => handleTabChange("newsletters")}
                disabled={tabLoading}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "newsletters"
                    ? "bg-white text-slate-900 shadow-md shadow-slate-200/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                } ${tabLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {tabLoading && activeTab !== "newsletters" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Newsletters</span>
                    <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">
                      {dashboardStats.newsletters}
                    </span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleTabChange("subscribers")}
                disabled={tabLoading}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "subscribers"
                    ? "bg-white text-slate-900 shadow-md shadow-slate-200/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                } ${tabLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {tabLoading && activeTab !== "subscribers" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Subscribers</span>
                    <span className="ml-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-semibold">
                      {dashboardStats.subscribers}
                    </span>
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Content with enhanced transition */}
        <div
          className={`transition-all duration-500 ${
            tabLoading
              ? "opacity-0 scale-[0.98] translate-y-2"
              : "opacity-100 scale-100 translate-y-0"
          }`}
        >
          {activeTab === "newsletters" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <NewsletterManagement />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SubscriberManagement />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
