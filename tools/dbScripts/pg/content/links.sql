DROP TABLE IF EXISTS "links" CASCADE;

CREATE TABLE "links" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "category" varchar(45) DEFAULT NULL,
  "url" varchar(255) DEFAULT NULL,
  "linkType" varchar(45) DEFAULT NULL,
  "linkData" varchar(255) DEFAULT NULL,
  "icon" varchar(45) DEFAULT NULL,
  "text" varchar(255) DEFAULT NULL,
  "sort" REAL DEFAULT NULL,
  "photo" varchar(255) DEFAULT NULL,
  "parentId" char(11) DEFAULT NULL,
  "visibility" varchar(45) DEFAULT 'everyone',
  "groupIds" text DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "links_churchId" ON "links" ("churchId");
