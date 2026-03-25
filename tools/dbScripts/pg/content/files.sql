DROP TABLE IF EXISTS "files" CASCADE;

CREATE TABLE "files" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "contentType" varchar(45) DEFAULT NULL,
  "contentId" char(11) DEFAULT NULL,
  "fileName" varchar(255) DEFAULT NULL,
  "contentPath" varchar(1024) DEFAULT NULL,
  "fileType" varchar(45) DEFAULT NULL,
  "size" INTEGER DEFAULT NULL,
  "dateModified" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "files_ix_churchId_id" ON "files" ("churchId", "id");
