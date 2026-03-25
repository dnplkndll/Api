DROP TABLE IF EXISTS "questions" CASCADE;

CREATE TABLE "questions" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "formId" char(11) DEFAULT NULL,
  "parentId" char(11) DEFAULT NULL,
  "title" varchar(255) DEFAULT NULL,
  "description" varchar(255) DEFAULT NULL,
  "fieldType" varchar(50) DEFAULT NULL,
  "placeholder" varchar(50) DEFAULT NULL,
  "sort" INTEGER DEFAULT NULL,
  "choices" text,
  "removed" BOOLEAN DEFAULT NULL,
  "required" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "questions_churchId" ON "questions" ("churchId");
CREATE INDEX IF NOT EXISTS "questions_formId" ON "questions" ("formId");
