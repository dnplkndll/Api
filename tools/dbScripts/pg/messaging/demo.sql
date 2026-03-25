-- Demo/seed data for messaging module (PostgreSQL)
-- Converted from MySQL demo.sql

-- Truncate tables (in reverse dependency order) to make re-runnable
TRUNCATE TABLE "deviceContents" CASCADE;
TRUNCATE TABLE "privateMessages" CASCADE;
TRUNCATE TABLE "sentTexts" CASCADE;
TRUNCATE TABLE "textingProviders" CASCADE;
TRUNCATE TABLE "emailTemplates" CASCADE;
TRUNCATE TABLE "deliveryLogs" CASCADE;
TRUNCATE TABLE "devices" CASCADE;
TRUNCATE TABLE "notificationPreferences" CASCADE;
TRUNCATE TABLE "notifications" CASCADE;
TRUNCATE TABLE "messages" CASCADE;
TRUNCATE TABLE "conversations" CASCADE;

-- Create stored procedure to reset demo data

    -- Truncate all tables in correct order (respecting foreign key constraints)

    -- ========================================
    -- Conversations
    -- ========================================
    INSERT INTO "conversations" ("id", "churchId", "contentType", "contentId", "title", "dateCreated", "groupId", "visibility", "firstPostId", "lastPostId", "postCount", "allowAnonymousPosts") VALUES
    ('CVS00000001', 'CHU00000001', 'group', 'GRP00000014', 'Young Families Discussion', (NOW() - INTERVAL '14 day'), 'GRP00000014', 'public', 'MSG00000001', 'MSG00000004', 4, false),
    ('CVS00000002', 'CHU00000001', 'group', 'GRP00000013', 'Youth Group Chat', (NOW() - INTERVAL '10 day'), 'GRP00000013', 'public', 'MSG00000005', 'MSG00000007', 3, false),
    ('CVS00000003', 'CHU00000001', 'church', 'CHU00000001', 'General Announcements', (NOW() - INTERVAL '30 day'), NULL, 'public', 'MSG00000008', 'MSG00000010', 3, false),
    ('CVS00000004', 'CHU00000001', 'group', 'GRP00000019', 'Praise Team Planning', (NOW() - INTERVAL '7 day'), 'GRP00000019', 'members', 'MSG00000011', 'MSG00000012', 2, false),
    ('CVS00000005', 'CHU00000001', 'church', 'CHU00000001', 'Prayer Requests', (NOW() - INTERVAL '21 day'), NULL, 'public', 'MSG00000013', 'MSG00000015', 3, false)
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Messages
    -- ========================================
    INSERT INTO "messages" ("id", "churchId", "conversationId", "displayName", "timeSent", "messageType", "content", "personId", "timeUpdated") VALUES
    -- Young Families Discussion (CVS00000001)
    ('MSG00000001', 'CHU00000001', 'CVS00000001', 'Michael Davis', (NOW() - INTERVAL '14 day'), 'message', 'Hey families! Who''s interested in a group picnic at the park this Saturday?', 'PER00000027', (NOW() - INTERVAL '14 day')),
    ('MSG00000002', 'CHU00000001', 'CVS00000001', 'Christopher Thomas', (NOW() - INTERVAL '13 day'), 'message', 'We''re in! The kids would love it. What time?', 'PER00000056', (NOW() - INTERVAL '13 day')),
    ('MSG00000003', 'CHU00000001', 'CVS00000001', 'Demo User', (NOW() - INTERVAL '13 day') + INTERVAL '2 hours', 'message', 'Count us in too! Should we bring anything?', 'PER00000082', (NOW() - INTERVAL '13 day') + INTERVAL '2 hours'),
    ('MSG00000004', 'CHU00000001', 'CVS00000001', 'Michael Davis', (NOW() - INTERVAL '12 day'), 'message', 'Let''s meet at 11 AM at Lincoln Park. Everyone bring a dish to share!', 'PER00000027', (NOW() - INTERVAL '12 day')),

    -- Youth Group Chat (CVS00000002)
    ('MSG00000005', 'CHU00000001', 'CVS00000002', 'Matthew Jones', (NOW() - INTERVAL '10 day'), 'message', 'Who else is pumped for the retreat next month?', 'PER00000018', (NOW() - INTERVAL '10 day')),
    ('MSG00000006', 'CHU00000001', 'CVS00000002', 'Andrew Wilson', (NOW() - INTERVAL '9 day'), 'message', 'Can''t wait! Are we doing the ropes course again?', 'PER00000051', (NOW() - INTERVAL '9 day')),
    ('MSG00000007', 'CHU00000001', 'CVS00000002', 'Sophia Jones', (NOW() - INTERVAL '9 day') + INTERVAL '3 hours', 'message', 'I signed up already! It''s going to be amazing.', 'PER00000019', (NOW() - INTERVAL '9 day') + INTERVAL '3 hours'),

    -- General Announcements (CVS00000003)
    ('MSG00000008', 'CHU00000001', 'CVS00000003', 'John Smith', (NOW() - INTERVAL '21 day'), 'message', 'Reminder: Church workday this Saturday starting at 8 AM. Bring gloves and tools!', 'PER00000001', (NOW() - INTERVAL '21 day')),
    ('MSG00000009', 'CHU00000001', 'CVS00000003', 'John Smith', (NOW() - INTERVAL '7 day'), 'message', 'The new fellowship hall renovations are complete. Come see the space after service this Sunday!', 'PER00000001', (NOW() - INTERVAL '7 day')),
    ('MSG00000010', 'CHU00000001', 'CVS00000003', 'Demo User', (NOW() - INTERVAL '3 day'), 'message', 'Don''t forget to sign up for the missions conference. Registration closes this Friday.', 'PER00000082', (NOW() - INTERVAL '3 day')),

    -- Praise Team Planning (CVS00000004)
    ('MSG00000011', 'CHU00000001', 'CVS00000004', 'Michael Davis', (NOW() - INTERVAL '5 day'), 'message', 'Song list for next Sunday: What a Beautiful Name, Good Good Father, Amazing Grace. Practice Thursday at 7 PM.', 'PER00000027', (NOW() - INTERVAL '5 day')),
    ('MSG00000012', 'CHU00000001', 'CVS00000004', 'David Lopez', (NOW() - INTERVAL '4 day'), 'message', 'Got it. I''ll prepare the chord charts for all three.', 'PER00000042', (NOW() - INTERVAL '4 day')),

    -- Prayer Requests (CVS00000005)
    ('MSG00000013', 'CHU00000001', 'CVS00000005', 'Miguel Hernandez', (NOW() - INTERVAL '18 day'), 'message', 'Please pray for my father Antonio''s recovery from hip surgery.', 'PER00000036', (NOW() - INTERVAL '18 day')),
    ('MSG00000014', 'CHU00000001', 'CVS00000005', 'Michelle Lee', (NOW() - INTERVAL '10 day'), 'message', 'Prayers requested for my children as they transition to new school.', 'PER00000070', (NOW() - INTERVAL '10 day')),
    ('MSG00000015', 'CHU00000001', 'CVS00000005', 'George Thompson', (NOW() - INTERVAL '2 day'), 'message', 'Praise report: Margaret''s test results came back clear! Thank you for your prayers.', 'PER00000073', (NOW() - INTERVAL '2 day'))
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Notifications
    -- ========================================
    INSERT INTO "notifications" ("id", "churchId", "personId", "contentType", "contentId", "timeSent", "isNew", "message", "link", "deliveryMethod", "triggeredByPersonId") VALUES
    ('NTF00000001', 'CHU00000001', 'PER00000082', 'conversation', 'CVS00000001', (NOW() - INTERVAL '12 day'), true, 'Michael Davis posted in Young Families Discussion', '/groups/GRP00000014', 'push', 'PER00000027'),
    ('NTF00000002', 'CHU00000001', 'PER00000082', 'conversation', 'CVS00000003', (NOW() - INTERVAL '7 day'), true, 'New announcement from John Smith', '/announcements', 'email', 'PER00000001'),
    ('NTF00000003', 'CHU00000001', 'PER00000027', 'conversation', 'CVS00000004', (NOW() - INTERVAL '4 day'), false, 'David Lopez replied in Praise Team Planning', '/groups/GRP00000019', 'push', 'PER00000042'),
    ('NTF00000004', 'CHU00000001', 'PER00000001', 'task', 'TSK00000001', (NOW() - INTERVAL '2 day'), true, 'New task assigned: Invite New Visitor to Lunch', '/tasks', 'push', 'PER00000027'),
    ('NTF00000005', 'CHU00000001', 'PER00000036', 'conversation', 'CVS00000005', (NOW() - INTERVAL '10 day'), false, 'Michelle Lee added a prayer request', '/prayer', 'push', 'PER00000070'),
    ('NTF00000006', 'CHU00000001', 'PER00000082', 'assignment', 'ASS00000008', (NOW() - INTERVAL '1 day'), true, 'You have been assigned Sound Tech for upcoming service', '/serving', 'email', 'PER00000027'),
    ('NTF00000007', 'CHU00000001', 'PER00000056', 'conversation', 'CVS00000001', (NOW() - INTERVAL '13 day'), false, 'Demo User replied in Young Families Discussion', '/groups/GRP00000014', 'push', 'PER00000082'),
    ('NTF00000008', 'CHU00000001', 'PER00000070', 'conversation', 'CVS00000005', (NOW() - INTERVAL '2 day'), true, 'George Thompson shared a praise report', '/prayer', 'push', 'PER00000073')
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Notification Preferences
    -- ========================================
    INSERT INTO "notificationPreferences" ("id", "churchId", "personId", "allowPush", "emailFrequency") VALUES
    ('NPR00000001', 'CHU00000001', 'PER00000082', true, 'realtime'),
    ('NPR00000002', 'CHU00000001', 'PER00000001', true, 'daily'),
    ('NPR00000003', 'CHU00000001', 'PER00000027', true, 'realtime'),
    ('NPR00000004', 'CHU00000001', 'PER00000036', true, 'weekly'),
    ('NPR00000005', 'CHU00000001', 'PER00000073', false, 'daily'),
    ('NPR00000006', 'CHU00000001', 'PER00000060', true, 'none')
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Devices
    -- ========================================
    INSERT INTO "devices" ("id", "appName", "deviceId", "churchId", "personId", "fcmToken", "label", "registrationDate", "lastActiveDate", "deviceInfo", "ipAddress") VALUES
    ('DEV00000001', 'B1Mobile', 'dev_demo_001', 'CHU00000001', 'PER00000082', 'fcm_token_demo_001', 'Demo iPhone', '2025-09-15 10:00:00', (NOW() - INTERVAL '1 hours'), '{"platform": "ios", "model": "iPhone 15", "osVersion": "18.2"}', '192.168.1.100'),
    ('DEV00000002', 'B1Mobile', 'dev_demo_002', 'CHU00000001', 'PER00000001', 'fcm_token_demo_002', 'John''s Android', '2025-10-01 10:00:00', (NOW() - INTERVAL '3 hours'), '{"platform": "android", "model": "Pixel 8", "osVersion": "15"}', '192.168.1.101'),
    ('DEV00000003', 'B1Mobile', 'dev_demo_003', 'CHU00000001', 'PER00000027', 'fcm_token_demo_003', 'Michael''s iPad', '2025-10-15 10:00:00', (NOW() - INTERVAL '12 hours'), '{"platform": "ios", "model": "iPad Pro", "osVersion": "18.2"}', '192.168.1.102'),
    ('DEV00000004', 'B1Checkin', 'dev_checkin_001', 'CHU00000001', NULL, 'fcm_token_checkin_001', 'Lobby Kiosk', '2025-08-01 10:00:00', (NOW() - INTERVAL '2 day'), '{"platform": "android", "model": "Samsung Tab", "osVersion": "14"}', '192.168.1.200'),
    ('DEV00000005', 'FreePlay', 'dev_freeplay_001', 'CHU00000001', NULL, NULL, 'Sanctuary TV', '2025-08-15 10:00:00', (NOW() - INTERVAL '1 day'), '{"platform": "androidtv", "model": "Shield TV", "osVersion": "13"}', '192.168.1.201')
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Delivery Logs
    -- ========================================
    INSERT INTO "deliveryLogs" ("id", "churchId", "personId", "contentType", "contentId", "deliveryMethod", "success", "errorMessage", "deliveryAddress", "attemptTime") VALUES
    ('DLG00000001', 'CHU00000001', 'PER00000082', 'notification', 'NTF00000001', 'push', true, NULL, 'fcm_token_demo_001', (NOW() - INTERVAL '12 day')),
    ('DLG00000002', 'CHU00000001', 'PER00000082', 'notification', 'NTF00000002', 'email', true, NULL, 'demo@b1.church', (NOW() - INTERVAL '7 day')),
    ('DLG00000003', 'CHU00000001', 'PER00000001', 'notification', 'NTF00000004', 'push', true, NULL, 'fcm_token_demo_002', (NOW() - INTERVAL '2 day')),
    ('DLG00000004', 'CHU00000001', 'PER00000036', 'notification', 'NTF00000005', 'push', true, NULL, NULL, (NOW() - INTERVAL '10 day')),
    ('DLG00000005', 'CHU00000001', 'PER00000073', 'notification', 'NTF00000008', 'email', false, 'Mailbox full', 'george.thompson@email.com', (NOW() - INTERVAL '2 day'))
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Email Templates
    -- ========================================
    INSERT INTO "emailTemplates" ("id", "churchId", "name", "subject", "htmlContent", "category", "dateCreated", "dateModified") VALUES
    ('ETP00000001', 'CHU00000001', 'Welcome Email', 'Welcome to Grace Community Church!',
      '<h1>Welcome!</h1><p>Dear {{name}},</p><p>We are so glad you visited Grace Community Church. We hope you felt at home and we look forward to seeing you again soon!</p><p>Blessings,<br/>Grace Community Church</p>',
      'visitor', (NOW() - INTERVAL '90 day'), (NOW() - INTERVAL '30 day')),
    ('ETP00000002', 'CHU00000001', 'Weekly Newsletter', '{{churchName}} Weekly Update',
      '<h1>This Week at Grace</h1><p>{{content}}</p><p>See you Sunday!</p>',
      'newsletter', (NOW() - INTERVAL '60 day'), (NOW() - INTERVAL '7 day')),
    ('ETP00000003', 'CHU00000001', 'Event Reminder', 'Reminder: {{eventName}} is coming up!',
      '<h1>Don''t Forget!</h1><p>{{eventName}} is happening on {{eventDate}}.</p><p>{{eventDescription}}</p><p>We hope to see you there!</p>',
      'event', (NOW() - INTERVAL '45 day'), (NOW() - INTERVAL '14 day')),
    ('ETP00000004', 'CHU00000001', 'Birthday Greeting', 'Happy Birthday from Grace Community Church!',
      '<h1>Happy Birthday, {{name}}!</h1><p>Wishing you a wonderful birthday filled with God''s blessings. We are thankful for you and your part in our church family.</p><p>With love,<br/>Grace Community Church</p>',
      'birthday', (NOW() - INTERVAL '90 day'), (NOW() - INTERVAL '60 day'))
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Texting Providers
    -- ========================================
    INSERT INTO "textingProviders" ("id", "churchId", "provider", "apiKey", "apiSecret", "fromNumber", "enabled") VALUES
    ('TXP00000001', 'CHU00000001', 'clearstream', 'demo_api_key_clearstream', NULL, '+12175550000', true)
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Sent Texts
    -- ========================================
    INSERT INTO "sentTexts" ("id", "churchId", "groupId", "recipientPersonId", "senderPersonId", "message", "recipientCount", "successCount", "failCount", "timeSent") VALUES
    ('STX00000001', 'CHU00000001', 'GRP00000001', NULL, 'PER00000001', 'Reminder: Service times are changing next Sunday. Morning service starts at 10:30 AM.', 45, 43, 2, (NOW() - INTERVAL '14 day')),
    ('STX00000002', 'CHU00000001', 'GRP00000013', NULL, 'PER00000027', 'Youth group is cancelled this Wednesday due to weather. Stay safe!', 12, 12, 0, (NOW() - INTERVAL '7 day')),
    ('STX00000003', 'CHU00000001', NULL, 'PER00000082', 'PER00000001', 'Hey Demo, can you cover sound tech this Sunday? Michael is out.', 1, 1, 0, (NOW() - INTERVAL '3 day'))
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Private Messages
    -- ========================================
    INSERT INTO "privateMessages" ("id", "churchId", "fromPersonId", "toPersonId", "conversationId", "notifyPersonId", "deliveryMethod") VALUES
    ('PRM00000001', 'CHU00000001', 'PER00000001', 'PER00000082', 'CVS00000003', 'PER00000082', 'push'),
    ('PRM00000002', 'CHU00000001', 'PER00000027', 'PER00000082', 'CVS00000004', 'PER00000082', 'email'),
    ('PRM00000003', 'CHU00000001', 'PER00000082', 'PER00000001', 'CVS00000003', 'PER00000001', 'push')
ON CONFLICT DO NOTHING;

    -- ========================================
    -- Device Contents
    -- ========================================
    INSERT INTO "deviceContents" ("id", "churchId", "deviceId", "contentType", "contentId") VALUES
    ('DCT00000001', 'CHU00000001', 'DEV00000005', 'playlist', 'PLY00000001'),
    ('DCT00000002', 'CHU00000001', 'DEV00000005', 'streamingService', 'STR00000001')
ON CONFLICT DO NOTHING;

-- Execute the stored procedure to populate demo data
