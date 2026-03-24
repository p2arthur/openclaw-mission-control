"use client";

export const dynamic = "force-dynamic";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Bot, Sparkles, FileText, Settings, Activity, Database, Users, Wrench, Heart, Zap, Target } from "lucide-react";

import { SignedIn, SignedOut, useAuth } from "@/auth/clerk";
import { useOrganizationMembership } from "@/lib/use-organization-membership";
import {
  useGetTemplateSetApiV1BoardsTemplatesTemplateIdGet,
  type TemplateSetDetail,
  type TemplateSpecialist,
} from "@/api/templates";
import { DashboardSidebar } from "@/components/organisms/DashboardSidebar";
import { DashboardShell } from "@/components/templates/DashboardShell";
import { Button } from "@/components/ui/button";

const TEMPLATE_TYPE_INFO: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  IDENTITY: { label: "Identity", icon: <Bot className="h-4 w-4" />, color: "bg-blue-100 text-blue-600" },
  SOUL: { label: "Soul", icon: <Sparkles className="h-4 w-4" />, color: "bg-purple-100 text-purple-600" },
  AGENTS: { label: "Agents", icon: <Users className="h-4 w-4" />, color: "bg-green-100 text-green-600" },
  TOOLS: { label: "Tools", icon: <Wrench className="h-4 w-4" />, color: "bg-amber-100 text-amber-600" },
  HEARTBEAT: { label: "Heartbeat", icon: <Heart className="h-4 w-4" />, color: "bg-rose-100 text-rose-600" },
  MEMORY: { label: "Memory", icon: <Database className="h-4 w-4" />, color: "bg-cyan-100 text-cyan-600" },
  USER: { label: "User", icon: <Users className="h-4 w-4" />, color: "bg-indigo-100 text-indigo-600" },
  SKILLS: { label: "Skills", icon: <Sparkles className="h-4 w-4" />, color: "bg-violet-100 text-violet-600" },
};

function getTemplateType(fileName: string): { key: string; info: typeof TEMPLATE_TYPE_INFO[string] } {
  const baseName = fileName.replace(/\.j2$/, "").replace(/\.md$/, "");
  
  for (const [key, info] of Object.entries(TEMPLATE_TYPE_INFO)) {
    if (baseName.toUpperCase().includes(key)) {
      return { key, info };
    }
  }
  
  return {
    key: "OTHER",
    info: { label: baseName, icon: <FileText className="h-4 w-4" />, color: "bg-slate-100 text-slate-600" },
  };
}

export default function TemplateDetailPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const params = useParams();
  const templateIdParam = params?.templateId;
  const templateId = Array.isArray(templateIdParam) ? templateIdParam[0] : templateIdParam;

  const { isAdmin } = useOrganizationMembership(isSignedIn);

  const templateQuery = useGetTemplateSetApiV1BoardsTemplatesTemplateIdGet(templateId ?? "", {
    query: {
      enabled: Boolean(isSignedIn && isAdmin && templateId),
      refetchOnMount: true,
      retry: false,
    },
  });

  const template: TemplateSetDetail | null = useMemo(() => {
    if (templateQuery.data?.status !== 200) return null;
    return templateQuery.data.data;
  }, [templateQuery.data]);

  const templateEntries = useMemo(() => {
    if (!template?.templates) return [];
    return Object.entries(template.templates).map(([name, path]) => ({
      name,
      path,
      ...getTemplateType(name),
    }));
  }, [template]);

  const isLoading = templateQuery.isLoading;
  const error = templateQuery.error;

  return (
    <DashboardShell>
      <SignedOut>
        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl surface-panel p-10 text-center">
          <p className="text-sm text-muted">Sign in to view agent templates.</p>
          <Button onClick={() => router.push("/sign-in")}>Sign in</Button>
        </div>
      </SignedOut>
      <SignedIn>
        <DashboardSidebar />
        {!isAdmin ? (
          <div className="flex h-full flex-col gap-6 rounded-2xl surface-panel p-4 md:p-8">
            <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-5 text-sm text-muted">
              Only organization owners and admins can access agent templates.
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-6 rounded-2xl surface-panel p-4 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-quiet">
                  Agent Templates
                </p>
                <h1 className="text-2xl font-semibold text-strong flex items-center gap-3">
                  {template?.emoji && (
                    <span className="text-3xl">{template.emoji}</span>
                  )}
                  {template?.name ?? "Template"}
                </h1>
                <p className="text-sm text-muted">
                  {template?.description ?? "Template details"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => router.push("/agent-templates")}>
                  Back to templates
                </Button>
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3 text-xs text-muted">
                {error.message}
              </div>
            ) : null}

            {isLoading ? (
              <div className="flex flex-1 items-center justify-center text-sm text-muted">
                Loading template details…
              </div>
            ) : template ? (
              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                {/* Left column: Template info */}
                <div className="space-y-6">
                  {/* Template Profile Card */}
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quiet mb-4">
                      Template Profile
                    </p>
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-3xl">
                        {template.emoji}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-strong">{template.name}</h2>
                        <p className="mt-1 text-sm text-muted">{template.description}</p>
                        <div className="mt-3 flex gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            ID: {template.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quiet mb-4 flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5" />
                      Skills
                    </p>
                    {!template.skills || template.skills.length === 0 ? (
                      <p className="text-sm text-muted">No skills defined for this template.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {template.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-200"
                          >
                            <Zap className="h-3 w-3" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Available Specialists */}
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quiet mb-4 flex items-center gap-2">
                      <Target className="h-3.5 w-3.5" />
                      Can Spawn
                    </p>
                    {!template.available_specialists || template.available_specialists.length === 0 ? (
                      <p className="text-sm text-muted">No specialist templates available.</p>
                    ) : (
                      <div className="space-y-3">
                        {template.available_specialists.map((specialist) => (
                          <div
                            key={specialist.id}
                            className="flex items-center gap-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-lg">
                              {specialist.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-strong">{specialist.name}</p>
                              <p className="text-xs text-muted truncate">{specialist.description}</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-500">
                              {specialist.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Template Files */}
                  <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quiet mb-4">
                      Template Files
                    </p>
                    <div className="space-y-3">
                      {templateEntries.length === 0 ? (
                        <p className="text-sm text-muted">No template files defined.</p>
                      ) : (
                        templateEntries.map((entry) => (
                          <div
                            key={entry.name}
                            className="flex items-center gap-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3"
                          >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${entry.info.color}`}>
                              {entry.info.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-strong">{entry.info.label}</p>
                              <p className="text-xs text-quiet truncate">{entry.path}</p>
                            </div>
                            <span className="text-xs text-quiet">{entry.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right column: Usage info */}
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quiet">
                      How to Use
                    </p>
                  </div>
                  <div className="space-y-4 text-sm text-muted">
                    <p>
                      This template defines the personality, skills, and behavior of a board's lead agent.
                    </p>
                    <div className="rounded-lg bg-[color:var(--surface)] p-4 border border-[color:var(--border)]">
                      <h3 className="font-semibold text-strong mb-2">Assign to a Board</h3>
                      <p className="text-xs">
                        Select this template when creating a new board, or update an existing board's template in settings.
                      </p>
                      <Link
                        href="/boards/new"
                        className="mt-3 inline-flex items-center text-xs text-[color:var(--accent)] hover:underline"
                      >
                        Create board with this template →
                      </Link>
                    </div>
                    <div className="rounded-lg bg-[color:var(--surface)] p-4 border border-[color:var(--border)]">
                      <h3 className="font-semibold text-strong mb-2">Customize</h3>
                      <p className="text-xs">
                        Template files are stored in <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">backend/templates/custom/{template.id}/</code>
                      </p>
                      <p className="mt-2 text-xs">
                        Edit the .j2 template files to customize the agent's behavior, then rebuild Mission Control.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-muted">
                Template not found.
              </div>
            )}
          </div>
        )}
      </SignedIn>
    </DashboardShell>
  );
}