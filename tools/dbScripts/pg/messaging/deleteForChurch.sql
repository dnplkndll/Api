DROP FUNCTION IF EXISTS "deleteForChurch"(char);

CREATE OR REPLACE FUNCTION "deleteForChurch"("pChurchId" char(11)) RETURNS void AS $$
BEGIN
  DELETE FROM connections WHERE "churchId" = "pChurchId";
  DELETE FROM conversations WHERE "churchId" = "pChurchId";
  DELETE FROM devices WHERE "churchId" = "pChurchId";
  DELETE FROM messages WHERE "churchId" = "pChurchId";
  DELETE FROM "notificationPreferences" WHERE "churchId" = "pChurchId";
  DELETE FROM notifications WHERE "churchId" = "pChurchId";
  DELETE FROM "privateMessages" WHERE "churchId" = "pChurchId";
  DELETE FROM "sentTexts" WHERE "churchId" = "pChurchId";
  DELETE FROM "textingProviders" WHERE "churchId" = "pChurchId";
END;
$$ LANGUAGE plpgsql;
