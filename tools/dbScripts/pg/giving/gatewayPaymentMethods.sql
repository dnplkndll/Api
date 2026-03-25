DROP TABLE IF EXISTS "gatewayPaymentMethods" CASCADE;

CREATE TABLE "gatewayPaymentMethods" (
  "id" char(11) NOT NULL,
  "churchId" char(11) NOT NULL,
  "gatewayId" char(11) NOT NULL,
  "customerId" varchar(255) NOT NULL,
  "externalId" varchar(255) NOT NULL,
  "methodType" varchar(50) DEFAULT NULL,
  "displayName" varchar(255) DEFAULT NULL,
  "metadata" json DEFAULT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "gpm_ux_external" UNIQUE ("gatewayId","externalId")
);
CREATE INDEX IF NOT EXISTS "gpm_idx_church" ON "gatewayPaymentMethods" ("churchId");
CREATE INDEX IF NOT EXISTS "gpm_idx_customer" ON "gatewayPaymentMethods" ("customerId");
