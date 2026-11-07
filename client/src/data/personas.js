/**
 * Client-side persona metadata. The behaviour lives on the server
 * (server/src/services/personas.js); these are the labels the picker shows.
 */
export const PERSONAS = [
  {
    id: "panel",
    label: "Service company panel",
    tagline: "Polite and structured. Fundamentals before depth.",
  },
  {
    id: "bar_raiser",
    label: "Big tech bar raiser",
    tagline: "Wants metrics, ownership and tradeoffs. Digs until you run dry.",
  },
  {
    id: "founder",
    label: "Startup founder",
    tagline: "Scoping under constraints. Rewards shipping over perfection.",
  },
  {
    id: "professor",
    label: "Fundamentals professor",
    tagline: "Asks why until you reach first principles.",
  },
  {
    id: "mentor",
    label: "Supportive mentor",
    tagline: "Kind delivery, same standards.",
  },
];

export const DEFAULT_PERSONA = "panel";
