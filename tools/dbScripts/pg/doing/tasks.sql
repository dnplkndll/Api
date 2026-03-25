DROP TABLE IF EXISTS "tasks" CASCADE;

CREATE TABLE "tasks" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "taskNumber" INTEGER DEFAULT NULL,
  "taskType" varchar(45) DEFAULT NULL,
  "dateCreated" TIMESTAMP DEFAULT NULL,
  "dateClosed" TIMESTAMP DEFAULT NULL,
  "associatedWithType" varchar(45) DEFAULT NULL,
  "associatedWithId" char(11) DEFAULT NULL,
  "associatedWithLabel" varchar(45) DEFAULT NULL,
  "createdByType" varchar(45) DEFAULT NULL,
  "createdById" char(11) DEFAULT NULL,
  "createdByLabel" varchar(45) DEFAULT NULL,
  "assignedToType" varchar(45) DEFAULT NULL,
  "assignedToId" char(11) DEFAULT NULL,
  "assignedToLabel" varchar(45) DEFAULT NULL,
  "title" varchar(255) DEFAULT NULL,
  "status" varchar(45) DEFAULT NULL,
  "automationId" char(11) DEFAULT NULL,
  "conversationId" char(11) DEFAULT NULL,
  "data" text,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "tasks_idx_church_status" ON "tasks" ("churchId", "status");
CREATE INDEX IF NOT EXISTS "tasks_idx_automation" ON "tasks" ("churchId", "automationId");
CREATE INDEX IF NOT EXISTS "tasks_idx_assigned" ON "tasks" ("churchId", "assignedToType", "assignedToId");
CREATE INDEX IF NOT EXISTS "tasks_idx_created" ON "tasks" ("churchId", "createdByType", "createdById");
