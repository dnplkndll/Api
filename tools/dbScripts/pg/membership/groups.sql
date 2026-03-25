DROP TABLE IF EXISTS "groups" CASCADE;

CREATE TABLE "groups" (
  "id" char(11) NOT NULL,
  "churchId" char(11) DEFAULT NULL,
  "categoryName" varchar(50) DEFAULT NULL,
  "name" varchar(50) DEFAULT NULL,
  "trackAttendance" BOOLEAN DEFAULT NULL,
  "parentPickup" BOOLEAN DEFAULT NULL,
  "printNametag" BOOLEAN DEFAULT NULL,
  "about" text DEFAULT NULL,
  "photoUrl" varchar(255) DEFAULT NULL,
  "removed" BOOLEAN DEFAULT NULL,
  "tags" varchar(45) DEFAULT NULL,
  "meetingTime" varchar(45) DEFAULT NULL,
  "meetingLocation" varchar(45) DEFAULT NULL,
  "labels" varchar(500) DEFAULT NULL,
  "slug" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "groups_id_UNIQUE" UNIQUE ("id")
);
CREATE INDEX IF NOT EXISTS "groups_churchId" ON "groups" ("churchId");
CREATE INDEX IF NOT EXISTS "groups_churchId_removed_tags" ON "groups" ("churchId", "removed", "tags");
CREATE INDEX IF NOT EXISTS "groups_churchId_removed_labels" ON "groups" ("churchId", "removed", "labels");
