DROP TABLE IF EXISTS "memberPermissions" CASCADE;

CREATE TABLE "memberPermissions" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "memberId" char(11) DEFAULT NULL,
  "contentType" varchar(45) DEFAULT NULL,
  "contentId" char(11) DEFAULT NULL,
  "action" varchar(45) DEFAULT NULL,
  "emailNotification" BOOLEAN DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "memberPermissions_churchId_contentId_memberId" ON "memberPermissions" ("churchId", "contentId", "memberId");
