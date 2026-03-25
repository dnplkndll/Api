DROP TABLE IF EXISTS "deliveryLogs" CASCADE;

CREATE TABLE "deliveryLogs" (
  "id" char(11) NOT NULL,
  "churchId" char(11),
  "personId" char(11),
  "contentType" varchar(20),
  "contentId" char(11),
  "deliveryMethod" varchar(10),
  "success" BOOLEAN,
  "errorMessage" varchar(500),
  "deliveryAddress" varchar(255),
  "attemptTime" TIMESTAMP,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "deliveryLogs_ix_content" ON "deliveryLogs" ("contentType", "contentId");
CREATE INDEX IF NOT EXISTS "deliveryLogs_ix_personId" ON "deliveryLogs" ("personId", "attemptTime");
CREATE INDEX IF NOT EXISTS "deliveryLogs_ix_churchId_time" ON "deliveryLogs" ("churchId", "attemptTime");
