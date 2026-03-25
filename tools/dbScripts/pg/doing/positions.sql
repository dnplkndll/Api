DROP TABLE IF EXISTS "positions" CASCADE;

CREATE TABLE "positions" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "planId" char(11) DEFAULT NULL,
  "categoryName" varchar(45) DEFAULT NULL,
  "name" varchar(45) DEFAULT NULL,
  "count" INTEGER DEFAULT NULL,
  "groupId" char(11) DEFAULT NULL,
  "allowSelfSignup" BOOLEAN DEFAULT FALSE,
  "description" text DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "positions_idx_church_plan" ON "positions" ("churchId", "planId");
CREATE INDEX IF NOT EXISTS "positions_idx_group" ON "positions" ("groupId");
