DROP TABLE IF EXISTS "pages" CASCADE;

CREATE TABLE "pages" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "url" varchar(255) DEFAULT NULL,
  "title" varchar(255) DEFAULT NULL,
  "layout" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "pages_uq_churchId_url" UNIQUE ("churchId","url")
);
