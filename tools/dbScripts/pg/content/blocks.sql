DROP TABLE IF EXISTS "blocks" CASCADE;

CREATE TABLE "blocks" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "blockType" varchar(45) DEFAULT NULL,
  "name" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("id")
);
