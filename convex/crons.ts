import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run daily at 00:15 UTC
crons.daily(
  "cleanup old messages",
  { hourUTC: 0, minuteUTC: 15 },
  internal.cleanup.cleanupOldMessages,
);

export default crons;
