DROP TABLE IF EXISTS "connections" CASCADE;

CREATE TABLE "connections" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "conversationId" char(11) DEFAULT NULL,
  "personId" char(11) DEFAULT NULL,
  "displayName" varchar(45) DEFAULT NULL,
  "timeJoined" TIMESTAMP DEFAULT NULL,
  "socketId" varchar(45) DEFAULT NULL,
  "ipAddress" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "connections_ix_churchId" ON "connections" ("churchId","conversationId");
