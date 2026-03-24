"use client";

import { useMemo } from "react";
import multiavatar from "@multiavatar/multiavatar/esm";

interface AgentAvatarProps {
  /** Agent name or ID used to generate the unique avatar */
  name: string;
  /** Size in pixels */
  size?: number;
  /** Optional CSS class name */
  className?: string;
  /** Whether to show the environment (circle background) */
  withEnvironment?: boolean;
}

/**
 * Generates a unique, deterministic SVG avatar for an agent using Multiavatar.
 *
 * The avatar is generated from the agent's name, ensuring:
 * - Same name always produces the same avatar
 * - Different names produce different avatars
 * - 12+ billion unique combinations possible
 */
export function AgentAvatar({
  name,
  size = 64,
  className = "",
  withEnvironment = true,
}: AgentAvatarProps) {
  const svgCode = useMemo(() => {
    if (!name) return "";
    try {
      return multiavatar(name, !withEnvironment);
    } catch {
      return "";
    }
  }, [name, withEnvironment]);

  if (!svgCode) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-slate-200 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-slate-400 text-xs">?</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
}
