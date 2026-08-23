export const SAMPLE_MEETINGS = [
  {
    id: "mtg_sprint_01",
    meeting_title: "Sprint 42 Architecture & Roadmap Review",
    participants: "Sarah Jenkins, Alex Rivera, Elena Rostova, Marcus Vance",
    department: "Engineering",
    audio_filename: "sample_sprint_review.mp3",
    audio_duration: "42:15",
    status: "completed",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    summary: "The engineering lead led an alignment meeting covering backend API versioning, frontend dark mode persistence, and Whisper AI pipeline throughput. Key performance metrics show speech-to-text processing speed reaching 1.2x real-time. Action items were assigned with deadlines for Q3 release.",
    transcript: [
      { timestamp: "00:00 - 02:15", speaker: "Sarah Jenkins (Product Lead)", text: "Welcome team. Today we are reviewing the Sprint 42 architecture and setting clear deliverables." },
      { timestamp: "02:16 - 08:45", speaker: "Alex Rivera (Tech Lead)", text: "Our FastAPI backend now supports versioned routers under /api/v1 and clean SQLite ORM integrations." },
      { timestamp: "08:46 - 15:30", speaker: "Elena Rostova (Frontend Lead)", text: "We completed the glassmorphic dashboard with dark mode persistence and responsive Tailwind styles." },
      { timestamp: "15:31 - 25:10", speaker: "Marcus Vance (DevOps Lead)", text: "Continuous integration tests pass cleanly and static assets are properly routed." }
    ],
    action_items: [
      { id: "act-101", owner: "Alex Rivera", task: "Implement database cleanup task for audio uploads storage.", priority: "High", deadline: "2026-08-28", status: "In Progress" },
      { id: "act-102", owner: "Elena Rostova", task: "Add interactive audio player with timestamp jumping.", priority: "High", deadline: "2026-08-27", status: "Completed" },
      { id: "act-103", owner: "Marcus Vance", task: "Setup Docker containerization for local developer setup.", priority: "Medium", deadline: "2026-08-30", status: "Pending" }
    ],
    decisions: [
      "Adopted FastAPI with Pydantic v2 schemas for all payload validations.",
      "Enforced dark mode class toggling in Tailwind CSS with LocalStorage state persistence.",
      "Selected Lucide React icons for all dashboard metric components."
    ],
    risks: [
      { title: "High API Request Concurrency", severity: "High", description: "Simultaneous upload requests may cause temporary DB lock in SQLite under heavy concurrency." },
      { title: "Client Audio Format Incompatibility", severity: "Medium", description: "Browsers on iOS may record in AAC audio wrapper requiring client-side extension check." }
    ],
    next_steps: [
      "Run complete test suit for upload endpoint and process endpoint.",
      "Conduct user feedback session on dashboard action item tables."
    ],
    keywords: ["Sprint 42", "FastAPI", "React 18", "Tailwind CSS", "SQLite", "Whisper", "CORS"]
  },
  {
    id: "mtg_client_sync",
    meeting_title: "Executive Client Sync - Unthinkable AI",
    participants: "David Kim, Sarah Jenkins, Priya Sharma",
    department: "Product Management",
    audio_filename: "client_sync.m4a",
    audio_duration: "28:30",
    status: "completed",
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    summary: "High-level client feedback review for the MeetingMind AI MVP. The client praised the glassmorphism visual aesthetics, top metrics summary cards, and quick TXT/JSON export capability.",
    transcript: [
      { timestamp: "00:00 - 05:10", speaker: "David Kim (Director)", text: "The UI design looks exceptionally polished. The contrast in dark mode is top notch." },
      { timestamp: "05:11 - 18:40", speaker: "Priya Sharma (Client Rep)", text: "We need the ability to copy summary and action items in one click, which works flawlessly." }
    ],
    action_items: [
      { id: "act-201", owner: "Sarah Jenkins", task: "Prepare internship evaluation presentation deck.", priority: "High", deadline: "2026-08-29", status: "In Progress" }
    ],
    decisions: [
      "Approved MVP feature set for final assignment delivery.",
      "Confirmed JSON & TXT export structure for executive reporting."
    ],
    risks: [
      { title: "Offline Demo Fallback", severity: "Low", description: "Ensure mock data fallback works gracefully when backend server is unreachable." }
    ],
    next_steps: [
      "Finalize documentation and installation steps in README.md"
    ],
    keywords: ["Unthinkable", "Internship", "UI Design", "Glassmorphism", "Executive Sync"]
  }
];
