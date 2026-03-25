DROP TABLE IF EXISTS "elements" CASCADE;

CREATE TABLE "elements" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "sectionId" char(11) DEFAULT NULL,
  "blockId" char(11) DEFAULT NULL,
  "elementType" varchar(45) DEFAULT NULL,
  "sort" REAL DEFAULT NULL,
  "parentId" char(11) DEFAULT NULL,
  "answersJSON" TEXT,
  "stylesJSON" TEXT,
  "animationsJSON" TEXT,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "elements_ix_churchId_blockId_sort" ON "elements" ("churchId", "blockId", "sort");
