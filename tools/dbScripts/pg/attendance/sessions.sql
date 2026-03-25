DROP TABLE IF EXISTS "sessions" CASCADE;

CREATE TABLE "sessions" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "groupId" char(11) DEFAULT NULL,
  "serviceTimeId" char(11) DEFAULT NULL,
  "sessionDate" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "sessions_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "sessions_churchId" ON "sessions" ("churchId");
CREATE INDEX IF NOT EXISTS "sessions_groupId" ON "sessions" ("groupId");
CREATE INDEX IF NOT EXISTS "sessions_serviceTimeId" ON "sessions" ("serviceTimeId");
CREATE INDEX IF NOT EXISTS "sessions_idx_church_session_date" ON "sessions" ("churchId", "sessionDate");
CREATE INDEX IF NOT EXISTS "sessions_idx_church_group_service" ON "sessions" ("churchId", "groupId", "serviceTimeId");
