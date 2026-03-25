DROP TABLE IF EXISTS "sections" CASCADE;

CREATE TABLE "sections" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "pageId" char(11) DEFAULT NULL,
  "blockId" char(11) DEFAULT NULL,
  "zone" varchar(45) DEFAULT NULL,
  "background" varchar(255) DEFAULT NULL,
  "textColor" varchar(45) DEFAULT NULL,
  "headingColor" varchar(45) DEFAULT NULL,
  "linkColor" varchar(45) DEFAULT NULL,
  "sort" REAL DEFAULT NULL,
  "targetBlockId" char(11) DEFAULT NULL,
  "answersJSON" TEXT,
  "stylesJSON" TEXT,
  "animationsJSON" TEXT,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "sections_ix_churchId_pageId_sort" ON "sections" ("churchId", "pageId", "sort");
CREATE INDEX IF NOT EXISTS "sections_ix_churchId_blockId_sort" ON "sections" ("churchId", "blockId", "sort");
