DROP TABLE IF EXISTS "forms" CASCADE;

CREATE TABLE "forms" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "name" varchar(255) DEFAULT NULL,
  "contentType" varchar(50) DEFAULT NULL,
  "createdTime" TIMESTAMP DEFAULT NULL,
  "modifiedTime" TIMESTAMP DEFAULT NULL,
  "accessStartTime" TIMESTAMP DEFAULT NULL,
  "accessEndTime" TIMESTAMP DEFAULT NULL,
  "restricted" BOOLEAN DEFAULT NULL,
  "archived" BOOLEAN DEFAULT NULL,
  "removed" BOOLEAN DEFAULT NULL,
  "thankYouMessage" text,
  PRIMARY KEY ("id"),
  CONSTRAINT "forms_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "forms_churchId" ON "forms" ("churchId");
CREATE INDEX IF NOT EXISTS "forms_churchId_removed_archived" ON "forms" ("churchId", "removed", "archived");
CREATE INDEX IF NOT EXISTS "forms_churchId_id" ON "forms" ("churchId", "id");
