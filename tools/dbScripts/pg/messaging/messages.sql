DROP TABLE IF EXISTS "messages" CASCADE;

CREATE TABLE "messages" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "conversationId" char(11) DEFAULT NULL,
  "displayName" varchar(45) DEFAULT NULL,
  "timeSent" TIMESTAMP DEFAULT NULL,
  "messageType" varchar(45) DEFAULT NULL,
  "content" text,
  "personId" char(11) DEFAULT NULL,
  "timeUpdated" TIMESTAMP DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "messages_ix_churchId" ON "messages" ("churchId","conversationId");
CREATE INDEX IF NOT EXISTS "messages_ix_timeSent" ON "messages" ("timeSent");
CREATE INDEX IF NOT EXISTS "messages_ix_personId" ON "messages" ("personId");
