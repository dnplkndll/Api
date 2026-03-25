DROP TABLE IF EXISTS "conditions" CASCADE;

CREATE TABLE "conditions" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "conjunctionId" char(11) DEFAULT NULL,
  "field" varchar(45) DEFAULT NULL,
  "fieldData" TEXT,
  "operator" varchar(45) DEFAULT NULL,
  "value" varchar(45) DEFAULT NULL,
  "label" varchar(255) DEFAULT NULL,
  PRIMARY KEY ("id")
);


