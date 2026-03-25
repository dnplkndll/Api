DROP TABLE IF EXISTS "eventLogs" CASCADE;

CREATE TABLE "eventLogs" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "customerId" varchar(255) DEFAULT NULL,
  "provider" varchar(50) DEFAULT NULL,
  "providerId" varchar(255) DEFAULT NULL,
  "status" varchar(50) DEFAULT NULL,
  "eventType" varchar(50) DEFAULT NULL,
  "message" text,
  "created" TIMESTAMP DEFAULT NULL,
  "resolved" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "eventLogs_idx_church_status_created" ON "eventLogs" ("churchId", "status", "created");
CREATE INDEX IF NOT EXISTS "eventLogs_idx_customer" ON "eventLogs" ("customerId");
CREATE INDEX IF NOT EXISTS "eventLogs_idx_provider_id" ON "eventLogs" ("providerId");
