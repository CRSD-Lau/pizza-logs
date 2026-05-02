-- Add fields to armory_gear_cache
ALTER TABLE "armory_gear_cache"
    ADD COLUMN "lastSuccessAt" TIMESTAMP(3),
    ADD COLUMN "sourceAgent" TEXT;

-- Create SyncJob model
CREATE TABLE "sync_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "agentId" TEXT,
    "error" TEXT,
    "result" JSONB
);

-- Create index for SyncJob
CREATE INDEX "sync_jobs_status_triggeredAt_idx" ON "sync_jobs"("status", "triggeredAt");
