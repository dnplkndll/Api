DROP TABLE IF EXISTS "notifications" CASCADE;

CREATE TABLE "notifications" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "contentType" varchar(45) DEFAULT NULL,
  "contentId" char(11) DEFAULT NULL,
  "timeSent" TIMESTAMP DEFAULT NULL,
  "isNew" BOOLEAN DEFAULT NULL,
  "message" text,
  "link" varchar(100) DEFAULT NULL,
  "deliveryMethod" varchar(10) DEFAULT NULL,
  "triggeredByPersonId" char(11) DEFAULT NULL,
  PRIMARY KEY ("id")
);

-- Migration for existing databases:
-- ALTER TABLE notifications ADD COLUMN triggeredByPersonId char(11) DEFAULT NULL; 
CREATE INDEX IF NOT EXISTS "notifications_churchId_personId_timeSent" ON "notifications" ("churchId", "personId", "timeSent");
CREATE INDEX IF NOT EXISTS "notifications_isNew" ON "notifications" ("isNew");
