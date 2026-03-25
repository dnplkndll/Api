DROP TABLE IF EXISTS "subscriptionFunds" CASCADE;

CREATE TABLE "subscriptionFunds" (
  "id" char(11) NOT NULL,
  "churchId" varchar(11) NOT NULL,
  "subscriptionId" varchar(255) DEFAULT NULL,
  "fundId" char(11) DEFAULT NULL,
  "amount" DOUBLE PRECISION DEFAULT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "subscriptionFunds_idx_church_subscription" ON "subscriptionFunds" ("churchId", "subscriptionId");
CREATE INDEX IF NOT EXISTS "subscriptionFunds_idx_church_fund" ON "subscriptionFunds" ("churchId", "fundId");
