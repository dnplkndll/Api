DROP TABLE IF EXISTS "automations" CASCADE;

CREATE TABLE "automations" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "title" varchar(45) DEFAULT NULL,
  "recurs" varchar(45) DEFAULT NULL,
  "active" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id")
);
