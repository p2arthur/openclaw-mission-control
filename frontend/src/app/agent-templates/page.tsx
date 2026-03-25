"use client";

export const dynamic = "force-dynamic";

import { useMemo } from "react";
import { Sparkles, FileText, FolderOpen, Plus } from "lucide-react";
import Link from "next/link";

import { useOrganizationMembership } from "@/lib/use-organization-membership";
import { useAuth } from "@/auth/clerk";
import { DashboardPageLayout } from "@/components/templates/DashboardPageLayout";
import {
  useListTemplateSetsApiV1BoardsTemplatesGet,
  type TemplateSet,
} from "@/api/templates";

export default function AgentTemplatesPage() {
  const { isSignedIn } = useAuth();
  const { isAdmin } = useOrganizationMembership(isSignedIn);

  const templatesQuery = useListTemplateSetsApiV1BoardsTemplatesGet({
    query: {
      enabled: Boolean(isSignedIn && isAdmin),
      refetchOnMount: true,
      retry: false,
    },
  });

  const templates = useMemo<TemplateSet[]>(() => {
    if (templatesQuery.data?.status !== 200) return [];
    return templatesQuery.data.data ?? [];
  }, [templatesQuery.data]);

  return (
    <DashboardPageLayout
      signedOut={{
        message: "Sign in to manage agent templates.",
        forceRedirectUrl: "/agent-templates",
        signUpForceRedirectUrl: "/agent-templates",
      }}
      title="Agent Templates"
      description="Template-driven agent specialization for your boards."
      isAdmin={isAdmin}
      adminOnlyMessage="Only organization admins can manage agent templates."
    >
      <div className="space-y-6">
        {/* Info Card */}
        <div className="rounded-xl border border-slate-200 bg-blue-50/50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">
                Template-Driven Agent Specialization
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Each board can be assigned a template that defines the personality,
                skills, and behavior of its lead agent. Templates live in{" "}
                <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono">
                  backend/templates/custom/
                </code>
                on your Mission Control server.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/boards/new"
                  className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create board with template
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Available Templates
          </h3>
          {templatesQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">No templates found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Link
                  key={template.id}
                  href={`/agent-templates/${template.id}`}
                  className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-2xl">
                      {template.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">
                        {template.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-600">
                        {template.description}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          ID: {template.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* How to Add Custom Templates */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <FolderOpen className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">
                How to Add Custom Templates
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Templates are defined by Jinja2 files in the backend. To add a new
                template:
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
                <li>
                  Create a directory:{" "}
                  <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono">
                    backend/templates/custom/your-template/
                  </code>
                </li>
                <li>
                  Add template files:{" "}
                  <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono">
                    IDENTITY.md.j2
                  </code>
                  ,{" "}
                  <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono">
                    SOUL.md.j2
                  </code>
                  ,{" "}
                  <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono">
                    AGENTS.md.j2
                  </code>
                  , etc.
                </li>
                <li>
                  Add a{" "}
                  <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono">
                    manifest.json
                  </code>{" "}
                  with name, description, and emoji.
                </li>
                <li>
                  Register in{" "}
                  <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono">
                    app/services/openclaw/constants.py
                  </code>
                </li>
                <li>Rebuild and restart Mission Control.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Template Structure */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">
                David Template Example
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                David is a Technical Product Manager template already included. You
                can use it as a reference when creating new templates.
              </p>
              <div className="mt-4 rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-300">
                <div className="text-slate-500"># Directory structure</div>
                <div className="mt-2 space-y-1 text-slate-300">
                  <div>backend/templates/custom/david/</div>
                  <div className="pl-4">├── AGENTS.md.j2</div>
                  <div className="pl-4">├── SOUL.md.j2</div>
                  <div className="pl-4">├── IDENTITY.md.j2</div>
                  <div className="pl-4">├── TOOLS.md.j2</div>
                  <div className="pl-4">├── HEARTBEAT.md.j2</div>
                  <div className="pl-4">├── MEMORY.md.j2</div>
                  <div className="pl-4">├── USER.md.j2</div>
                  <div className="pl-4">└── manifest.json</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
