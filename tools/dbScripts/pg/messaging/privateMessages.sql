DROP TABLE IF EXISTS "privateMessages" CASCADE;

CREATE TABLE "privateMessages" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "fromPersonId" char(11) DEFAULT NULL,
  "toPersonId" char(11) DEFAULT NULL,
  "conversationId" char(11) DEFAULT NULL,
  "notifyPersonId" char(11) DEFAULT NULL,
  "deliveryMethod" varchar(10) DEFAULT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "privateMessages_IX_churchFrom" ON "privateMessages" ("churchId","fromPersonId");
CREATE INDEX IF NOT EXISTS "privateMessages_IX_churchTo" ON "privateMessages" ("churchId","toPersonId");
CREATE INDEX IF NOT EXISTS "privateMessages_IX_notifyPersonId" ON "privateMessages" ("churchId", "notifyPersonId");
CREATE INDEX IF NOT EXISTS "privateMessages_IX_conversationId" ON "privateMessages" ("conversationId");
