DROP TABLE IF EXISTS "planItems" CASCADE;

CREATE TABLE "planItems" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "planId" char(11) DEFAULT NULL,
  "parentId" char(11) DEFAULT NULL,
  "sort" REAL DEFAULT NULL,
  "itemType" varchar(45) DEFAULT NULL,
  "relatedId" char(11) DEFAULT NULL,
  "label" varchar(100) DEFAULT NULL,
  "description" varchar(1000) DEFAULT NULL,
  "seconds" INTEGER DEFAULT NULL,
  "link" varchar(1000) DEFAULT NULL,
  "providerId" varchar(50) DEFAULT NULL,
  "providerPath" varchar(500) DEFAULT NULL,
  "providerContentPath" varchar(50) DEFAULT NULL,
  "thumbnailUrl" varchar(1024) DEFAULT NULL,
  PRIMARY KEY ("id")
); 
CREATE INDEX IF NOT EXISTS "planItems_idx_church_plan" ON "planItems" ("churchId", "planId");
CREATE INDEX IF NOT EXISTS "planItems_idx_parent" ON "planItems" ("parentId");
