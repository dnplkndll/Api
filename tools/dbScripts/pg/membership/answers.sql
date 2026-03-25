DROP TABLE IF EXISTS "answers" CASCADE;

CREATE TABLE "answers" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "formSubmissionId" char(11) DEFAULT NULL,
  "questionId" char(11) DEFAULT NULL,
  "value" varchar(4000) DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "answers_churchId" ON "answers" ("churchId");
CREATE INDEX IF NOT EXISTS "answers_formSubmissionId" ON "answers" ("formSubmissionId");
CREATE INDEX IF NOT EXISTS "answers_questionId" ON "answers" ("questionId");
