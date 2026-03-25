DROP TABLE IF EXISTS "notes" CASCADE;

CREATE TABLE "notes" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "contentType" varchar(50) DEFAULT NULL,
  "contentId" char(11) DEFAULT NULL,
  "noteType" varchar(50) DEFAULT NULL,
  "addedBy" char(11) DEFAULT NULL,
  "createdAt" TIMESTAMP DEFAULT NULL,
  "contents" text,
  "updatedAt" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "notes_id_UNIQUE" UNIQUE ("id")
); 
CREATE INDEX IF NOT EXISTS "notes_churchId" ON "notes" ("churchId");
