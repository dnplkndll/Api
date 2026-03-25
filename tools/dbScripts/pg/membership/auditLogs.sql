DROP TABLE IF EXISTS "auditLogs" CASCADE;

CREATE TABLE "auditLogs" (
  "id" char(11) NOT NULL,
  "churchId" char(11) NOT NULL,
  "userId" char(11) DEFAULT NULL,
  "category" varchar(50) NOT NULL,
  "action" varchar(100) NOT NULL,
  "entityType" varchar(100) DEFAULT NULL,
  "entityId" char(11) DEFAULT NULL,
  "details" text DEFAULT NULL,
  "ipAddress" varchar(45) DEFAULT NULL,
  "created" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "auditLogs_ix_auditLogs_church_created" ON "auditLogs" ("churchId", "created");
CREATE INDEX IF NOT EXISTS "auditLogs_ix_auditLogs_church_category" ON "auditLogs" ("churchId", "category");
CREATE INDEX IF NOT EXISTS "auditLogs_ix_auditLogs_church_userId" ON "auditLogs" ("churchId", "userId");
CREATE INDEX IF NOT EXISTS "auditLogs_ix_auditLogs_church_entity" ON "auditLogs" ("churchId", "entityType", "entityId");
