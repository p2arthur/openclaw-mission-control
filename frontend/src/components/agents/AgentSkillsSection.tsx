"use client";

import { useMemo } from "react";

import { type AgentRead } from "@/api/generated/model";

interface AgentSkillsSectionProps {
  agent: AgentRead;
}

// Skill definitions matching the SKILLS.md.j2 templates
const AGENT_SKILLS: Record<string, Record<string, { emoji: string; description: string }>> = {
  frontend_engineer: {
    "Component Architecture": {
      emoji: "🧩",
      description: "Building reusable, composable UI components with clear interfaces",
    },
    Accessibility: {
      emoji: "♿",
      description: "WCAG 2.1 AA compliance, keyboard navigation, screen reader support",
    },
    "Responsive Design": {
      emoji: "📱",
      description: "Mobile-first layouts that work across all viewport sizes",
    },
    "State Management": {
      emoji: "🔄",
      description: "Local state, context, external stores, server state caching",
    },
    Testing: {
      emoji: "🧪",
      description: "Unit, integration, and e2e tests with Testing Library best practices",
    },
    "CSS / Styling": {
      emoji: "🎨",
      description: "Design tokens, Tailwind, animations, theming patterns",
    },
    Delegation: {
      emoji: "📋",
      description: "Breaking down features into parallelizable tasks (lead only)",
    },
  },
  technical_product_manager: {
    "Task Scoping & Planning": {
      emoji: "📐",
      description: "Breaking vague requests into concrete, estimable tasks",
    },
    "Stakeholder Communication": {
      emoji: "📣",
      description: "Status updates, blocker escalation, scope negotiation",
    },
    "Technical Decision Records": {
      emoji: "📝",
      description: "Documenting architecture decisions and trade-offs",
    },
    "Agent Coordination": {
      emoji: "🤝",
      description: "Multi-agent workflows, delegation, conflict resolution",
    },
    "Quality Gates & Review": {
      emoji: "✅",
      description: "Definition of done enforcement, scope verification",
    },
    "Board Health Monitoring": {
      emoji: "💚",
      description: "Delivery risk detection, velocity tracking (lead only)",
    },
  },
};

/**
 * Displays the agent's available skills as a visual skill tree.
 *
 * Reads from the agent's role in identity_profile to determine which skills apply.
 * Skills are shown as badges with emoji and descriptions.
 */
export function AgentSkillsSection({ agent }: AgentSkillsSectionProps) {
  const identityProfile = useMemo(() => {
    if (!agent.identity_profile || typeof agent.identity_profile !== "object") {
      return null;
    }
    return agent.identity_profile as Record<string, string | undefined>;
  }, [agent.identity_profile]);

  const role = identityProfile?.role?.toLowerCase().replace(/\s+/g, "_") ?? "";
  const skills = useMemo(() => {
    // Try to match by role slug
    const roleSkills = AGENT_SKILLS[role];
    if (roleSkills) return roleSkills;

    // Fallback: try partial match
    for (const [key, value] of Object.entries(AGENT_SKILLS)) {
      if (role.includes(key) || key.includes(role)) {
        return value;
      }
    }

    return null;
  }, [role]);

  if (!skills) {
    return (
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-quiet mb-4">
          Skills
        </p>
        <p className="text-sm text-muted">
          No skills defined for this agent role. Add a SKILLS.md template to define abilities.
        </p>
      </div>
    );
  }

  const skillEntries = Object.entries(skills);
  const leadSkills = skillEntries.filter(
    ([name]) => name.toLowerCase().includes("delegation") || name.toLowerCase().includes("board health")
  );
  const coreSkills = skillEntries.filter(
    ([name]) => !name.toLowerCase().includes("delegation") && !name.toLowerCase().includes("board health")
  );

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-quiet">
          Skills
        </p>
        <span className="text-xs text-muted">
          {skillEntries.length} abilities
        </span>
      </div>

      {/* Core skills */}
      <div className="space-y-3">
        {coreSkills.map(([name, { emoji, description }]) => (
          <div
            key={name}
            className="flex items-start gap-3 rounded-xl bg-[color:var(--surface-muted)] p-3 transition hover:bg-indigo-50"
          >
            <span className="text-xl flex-shrink-0">{emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-strong text-sm">{name}</p>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lead-only skills */}
      {agent.is_board_lead && leadSkills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-quiet mb-3 flex items-center gap-1">
            <span>👑</span> Lead Abilities
          </p>
          <div className="space-y-3">
            {leadSkills.map(([name, { emoji, description }]) => (
              <div
                key={name}
                className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-3"
              >
                <span className="text-xl flex-shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-strong text-sm">{name}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
