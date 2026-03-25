DROP TABLE IF EXISTS "conversations" CASCADE;

CREATE TABLE "conversations" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "contentType" varchar(45) DEFAULT NULL,
  "contentId" varchar(255) DEFAULT NULL,
  "title" varchar(255) DEFAULT NULL,
  "dateCreated" TIMESTAMP DEFAULT NULL,
  "groupId" char(11) DEFAULT NULL,
  "visibility" varchar(45) DEFAULT NULL,
  "firstPostId" char(11) DEFAULT NULL,
  "lastPostId" char(11) DEFAULT NULL,
  "postCount" INTEGER DEFAULT NULL,
  "allowAnonymousPosts" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "conversations_ix_churchId" ON "conversations" ("churchId","contentType","contentId");
