DROP TABLE IF EXISTS "emailTemplates" CASCADE;
CREATE TABLE "emailTemplates" (
  "id" char(11) NOT NULL,
  "churchId" char(11) NOT NULL,
  "name" varchar(255) NOT NULL,
  "subject" varchar(500) NOT NULL,
  "htmlContent" text NOT NULL,
  "category" varchar(100) DEFAULT NULL,
  "dateCreated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "dateModified" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "emailTemplates_ix_churchId" ON "emailTemplates" ("churchId");
