"""Shared constants for lifecycle orchestration services."""

from __future__ import annotations

import random
import re
from datetime import timedelta
from typing import Any

_GATEWAY_OPENCLAW_AGENT_PREFIX = "mc-gateway-"
_GATEWAY_AGENT_PREFIX = f"agent:{_GATEWAY_OPENCLAW_AGENT_PREFIX}"
_GATEWAY_AGENT_SUFFIX = ":main"

DEFAULT_HEARTBEAT_CONFIG: dict[str, Any] = {
    "every": "10m",
    "target": "last",
    "includeReasoning": False,
}

OFFLINE_AFTER = timedelta(minutes=10)
# Provisioning convergence policy:
# - require first heartbeat/check-in within 30s of wake
# - allow up to 3 wake attempts before giving up
CHECKIN_DEADLINE_AFTER_WAKE = timedelta(seconds=30)
MAX_WAKE_ATTEMPTS_WITHOUT_CHECKIN = 3
AGENT_SESSION_PREFIX = "agent"

DEFAULT_CHANNEL_HEARTBEAT_VISIBILITY: dict[str, bool] = {
    # Suppress routine HEARTBEAT_OK delivery by default.
    "showOk": False,
    "showAlerts": True,
    "useIndicator": True,
}

DEFAULT_IDENTITY_PROFILE = {
    "role": "Generalist",
    "communication_style": "direct, concise, practical",
    "emoji": ":gear:",
}

IDENTITY_PROFILE_FIELDS = {
    "role": "identity_role",
    "communication_style": "identity_communication_style",
    "emoji": "identity_emoji",
}

EXTRA_IDENTITY_PROFILE_FIELDS = {
    "autonomy_level": "identity_autonomy_level",
    "verbosity": "identity_verbosity",
    "output_format": "identity_output_format",
    "update_cadence": "identity_update_cadence",
    # Per-agent charter (optional).
    # Used to give agents a "purpose in life" and a distinct vibe.
    "purpose": "identity_purpose",
    "personality": "identity_personality",
    "custom_instructions": "identity_custom_instructions",
}

DEFAULT_GATEWAY_FILES = frozenset(
    {
        "AGENTS.md",
        "SOUL.md",
        "TOOLS.md",
        "IDENTITY.md",
        "USER.md",
        "HEARTBEAT.md",
        "MEMORY.md",
    },
)

# Lead-only workspace contract. Used for board leads to allow an iterative rollout
# without changing worker templates.
LEAD_GATEWAY_FILES = frozenset(
    {
        "AGENTS.md",
        "BOOTSTRAP.md",
        "IDENTITY.md",
        "SOUL.md",
        "USER.md",
        "MEMORY.md",
        "TOOLS.md",
        "HEARTBEAT.md",
    },
)

# These files are intended to evolve within the agent workspace.
# Provision them if missing, but avoid overwriting existing content during updates.
#
# Examples:
# - USER.md: human-provided context + lead intake notes
# - MEMORY.md: curated long-term memory (consolidated)
PRESERVE_AGENT_EDITABLE_FILES = frozenset({"USER.md", "MEMORY.md"})

HEARTBEAT_LEAD_TEMPLATE = "BOARD_HEARTBEAT.md.j2"
HEARTBEAT_AGENT_TEMPLATE = "BOARD_HEARTBEAT.md.j2"
SESSION_KEY_PARTS_MIN = 2
_SESSION_KEY_PARTS_MIN = SESSION_KEY_PARTS_MIN

MAIN_TEMPLATE_MAP = {
    "AGENTS.md": "BOARD_AGENTS.md.j2",
    "IDENTITY.md": "BOARD_IDENTITY.md.j2",
    "SOUL.md": "BOARD_SOUL.md.j2",
    "MEMORY.md": "BOARD_MEMORY.md.j2",
    "HEARTBEAT.md": "BOARD_HEARTBEAT.md.j2",
    "USER.md": "BOARD_USER.md.j2",
    "TOOLS.md": "BOARD_TOOLS.md.j2",
}

BOARD_SHARED_TEMPLATE_MAP = {
    "AGENTS.md": "BOARD_AGENTS.md.j2",
    "BOOTSTRAP.md": "BOARD_BOOTSTRAP.md.j2",
    "IDENTITY.md": "BOARD_IDENTITY.md.j2",
    "SOUL.md": "BOARD_SOUL.md.j2",
    "MEMORY.md": "BOARD_MEMORY.md.j2",
    "HEARTBEAT.md": "BOARD_HEARTBEAT.md.j2",
    "USER.md": "BOARD_USER.md.j2",
    "TOOLS.md": "BOARD_TOOLS.md.j2",
}

LEAD_TEMPLATE_MAP: dict[str, str] = {}

# Custom agent template sets
# These are user-defined templates stored in backend/templates/custom/
CUSTOM_TEMPLATE_SETS = {
    "david": {
        "name": "David",
        "description": "Technical Product Manager — your friendly PM with engineering chops",
        "emoji": "🎯",
        "templates": {
            "AGENTS.md": "custom/david/AGENTS.md.j2",
            "SOUL.md": "custom/david/SOUL.md.j2",
            "IDENTITY.md": "custom/david/IDENTITY.md.j2",
            "TOOLS.md": "custom/david/TOOLS.md.j2",
            "HEARTBEAT.md": "custom/david/HEARTBEAT.md.j2",
            "MEMORY.md": "custom/david/MEMORY.md.j2",
            "USER.md": "custom/david/USER.md.j2",
            "SKILLS.md": "custom/david/SKILLS.md.j2",
        },
    },
    "felipe": {
        "name": "Felipe",
        "description": "Frontend Engineer — React/Next.js specialist. Pixel-precise, design-aware, moves fast without breaking things.",
        "emoji": "⚡",
        "templates": {
            "AGENTS.md": "custom/felipe/AGENTS.md.j2",
            "SOUL.md": "custom/felipe/SOUL.md.j2",
            "IDENTITY.md": "custom/felipe/IDENTITY.md.j2",
            "TOOLS.md": "custom/felipe/TOOLS.md.j2",
            "HEARTBEAT.md": "custom/felipe/HEARTBEAT.md.j2",
            "MEMORY.md": "custom/felipe/MEMORY.md.j2",
            "USER.md": "custom/felipe/USER.md.j2",
            "SKILLS.md": "custom/felipe/SKILLS.md.j2",
        },
    },
}

DEFAULT_TEMPLATE_SET = "default"


def get_template_map(template_set: str = DEFAULT_TEMPLATE_SET, is_lead: bool = False) -> dict[str, str]:
    """Get the template mapping for a given template set.
    
    Args:
        template_set: The template set name ("default" or custom like "david")
        is_lead: Whether this is for a board lead agent
        
    Returns:
        Dictionary mapping output filenames to template paths
    """
    if template_set == DEFAULT_TEMPLATE_SET or template_set not in CUSTOM_TEMPLATE_SETS:
        # Use default templates
        if is_lead:
            return {**BOARD_SHARED_TEMPLATE_MAP, **LEAD_TEMPLATE_MAP}
        return BOARD_SHARED_TEMPLATE_MAP
    
    # Use custom template set
    return CUSTOM_TEMPLATE_SETS[template_set]["templates"]


def get_template_set_manifest(template_set: str) -> dict[str, Any] | None:
    """Get the manifest config for a named template set, or None if not found."""
    return CUSTOM_TEMPLATE_SETS.get(template_set)


def list_available_template_sets() -> list[dict[str, str]]:
    """List all available template sets for UI display."""
    templates = [
        {
            "id": DEFAULT_TEMPLATE_SET,
            "name": "Default",
            "description": "Standard Mission Control agent",
            "emoji": "⚙️",
        }
    ]
    
    for template_id, config in CUSTOM_TEMPLATE_SETS.items():
        templates.append({
            "id": template_id,
            "name": config["name"],
            "description": config["description"],
            "emoji": config.get("emoji", "🤖"),
        })
    
    return templates

_TOOLS_KV_RE = re.compile(r"^(?P<key>[A-Z0-9_]+)=(?P<value>.*)$")
_NON_TRANSIENT_GATEWAY_ERROR_MARKERS = ("unsupported file",)
_TRANSIENT_GATEWAY_ERROR_MARKERS = (
    "connect call failed",
    "connection refused",
    "errno 111",
    "econnrefused",
    "did not receive a valid http response",
    "no route to host",
    "network is unreachable",
    "host is down",
    "name or service not known",
    "received 1012",
    "service restart",
    "http 503",
    "http 502",
    "http 504",
    "temporar",
    "timeout",
    "timed out",
    "connection closed",
    "connection reset",
)

_COORDINATION_GATEWAY_TIMEOUT_S = 45.0
_COORDINATION_GATEWAY_BASE_DELAY_S = 0.5
_COORDINATION_GATEWAY_MAX_DELAY_S = 5.0
_SECURE_RANDOM = random.SystemRandom()
