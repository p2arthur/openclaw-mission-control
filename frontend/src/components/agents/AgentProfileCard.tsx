"use client";

import { useMemo } from "react";
import Link from "next/link";

import { type AgentRead } from "@/api/generated/model";
import { AgentAvatar } from "./AgentAvatar";
import { StatusPill } from "@/components/atoms/StatusPill";
import { formatRelativeTimestamp } from "@/lib/formatters";

interface AgentProfileCardProps {
  agent: AgentRead;
  /** Whether this is a compact view (for lists) */
  compact?: boolean;
  /** Optional link to board */
  boardName?: string;
  boardId?: string;
}

/**
 * Agent profile card showing avatar, name, role, and key metadata.
 *
 * Designed to feel game-like — like a character card in a team roster.
 */
export function AgentProfileCard({
  agent,
  compact = false,
  boardName,
  boardId,
}: AgentProfileCardProps) {
  const identityProfile = useMemo(() => {
    if (!agent.identity_profile || typeof agent.identity_profile !== "object") {
      return null;
    }
    return agent.identity_profile as Record<string, string | undefined>;
  }, [agent.identity_profile]);

  const role = identityProfile?.role ?? "Agent";
  const emoji = identityProfile?.emoji ?? "🤖";
  const communicationStyle = identityProfile?.communication_style;
  const purpose = identityProfile?.purpose;

  if (compact) {
    return (
      <Link
        href={`/agents/${agent.id}`}
        className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 transition hover:border-[color:var(--accent)] hover:shadow-sm"
      >
        <AgentAvatar name={agent.name} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-strong truncate">{agent.name}</p>
            <span className="text-lg">{emoji}</span>
          </div>
          <p className="text-xs text-muted truncate">{role}</p>
        </div>
        <StatusPill status={agent.status ?? "unknown"} />
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] overflow-hidden">
      {/* Header with gradient background */}
      <div className="relative h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute -bottom-8 left-6">
          <div className="rounded-2xl border-4 border-[color:var(--surface)] bg-white p-1 shadow-lg">
            <AgentAvatar name={agent.name} size={80} />
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="pt-12 px-6 pb-6">
        {/* Name and role */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-strong">{agent.name}</h2>
              <span className="text-2xl">{emoji}</span>
            </div>
            <p className="text-sm text-muted mt-0.5">{role}</p>
          </div>
          <StatusPill status={agent.status ?? "unknown"} />
        </div>

        {/* Purpose / Description */}
        {purpose && (
          <p className="mt-4 text-sm text-muted leading-relaxed">{purpose}</p>
        )}

        {/* Communication style badge */}
        {communicationStyle && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-quiet mb-1">
              Communication Style
            </p>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
              {communicationStyle}
            </span>
          </div>
        )}

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-strong">
              {agent.is_board_lead ? "👑" : "⚡"}
            </p>
            <p className="text-xs text-muted mt-1">
              {agent.is_board_lead ? "Lead" : "Worker"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-strong">
              {formatRelativeTimestamp(agent.last_seen_at)}
            </p>
            <p className="text-xs text-muted mt-1">Last seen</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-strong">
              {agent.openclaw_session_id ? "🔗" : "—"}
            </p>
            <p className="text-xs text-muted mt-1">Session</p>
          </div>
        </div>

        {/* Board link */}
        {boardName && boardId && (
          <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-quiet mb-1">
              Board
            </p>
            <Link
              href={`/boards/${boardId}`}
              className="text-sm font-medium text-[color:var(--accent)] hover:underline"
            >
              {boardName}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
