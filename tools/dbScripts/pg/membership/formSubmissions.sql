DROP TABLE IF EXISTS "formSubmissions" CASCADE;

CREATE TABLE "formSubmissions" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "formId" char(11) DEFAULT NULL,
  "contentType" varchar(50) DEFAULT NULL,
  "contentId" char(11) DEFAULT NULL,
  "submissionDate" TIMESTAMP DEFAULT NULL,
  "submittedBy" char(11) DEFAULT NULL,
  "revisionDate" TIMESTAMP DEFAULT NULL,
  "revisedBy" char(11) DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "formSubmissions_churchId" ON "formSubmissions" ("churchId");
CREATE INDEX IF NOT EXISTS "formSubmissions_formId" ON "formSubmissions" ("formId");
