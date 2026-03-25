DROP TABLE IF EXISTS "pageHistory" CASCADE;

CREATE TABLE "pageHistory" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "pageId" char(11) DEFAULT NULL,
  "blockId" char(11) DEFAULT NULL,
  "snapshotJSON" TEXT,
  "description" varchar(200) DEFAULT NULL,
  "userId" char(11) DEFAULT NULL,
  "createdDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "pageHistory_ix_pageId" ON "pageHistory" ("pageId", "createdDate");
CREATE INDEX IF NOT EXISTS "pageHistory_ix_blockId" ON "pageHistory" ("blockId", "createdDate");
