DROP TABLE IF EXISTS "actions" CASCADE;

CREATE TABLE "actions" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "automationId" char(11) DEFAULT NULL,
  "actionType" varchar(45) DEFAULT NULL,
  "actionData" TEXT,
  PRIMARY KEY ("id")
);
