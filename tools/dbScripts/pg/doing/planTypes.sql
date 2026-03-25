DROP TABLE IF EXISTS "planTypes" CASCADE;

CREATE TABLE "planTypes" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "ministryId" char(11) DEFAULT NULL,
  "name" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("id")
);