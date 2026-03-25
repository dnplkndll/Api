-- Demo/seed data for membership module (PostgreSQL)
-- Converted from MySQL demo.sql

-- Truncate tables (in reverse dependency order) to make re-runnable
TRUNCATE TABLE "visibilityPreferences" CASCADE;
TRUNCATE TABLE "answers" CASCADE;
TRUNCATE TABLE "formSubmissions" CASCADE;
TRUNCATE TABLE "questions" CASCADE;
TRUNCATE TABLE "forms" CASCADE;
TRUNCATE TABLE "userChurches" CASCADE;
TRUNCATE TABLE "roleMembers" CASCADE;
TRUNCATE TABLE "rolePermissions" CASCADE;
TRUNCATE TABLE "roles" CASCADE;
TRUNCATE TABLE "users" CASCADE;
TRUNCATE TABLE "groupMembers" CASCADE;
TRUNCATE TABLE "groups" CASCADE;
TRUNCATE TABLE "notes" CASCADE;
TRUNCATE TABLE "people" CASCADE;
TRUNCATE TABLE "households" CASCADE;
TRUNCATE TABLE "churches" CASCADE;

-- Create stored procedure to reset demo data

    -- Truncate all tables in correct order (respecting foreign key constraints)

-- Demo Church
INSERT INTO "churches" ("id", "name", "subDomain", "address1", "city", "state", "zip", "country", "latitude", "longitude") VALUES 
('CHU00000001', 'Grace Community Church', 'grace', '123 Main Street', 'Springfield', 'IL', '62701', 'US', 39.7817, -89.6501)
ON CONFLICT DO NOTHING;

-- Demo Households (25 households)
INSERT INTO "households" ("id", "churchId", "name") VALUES 
('HOU00000001', 'CHU00000001', 'Smith Family'),
('HOU00000002', 'CHU00000001', 'Johnson Family'),
('HOU00000003', 'CHU00000001', 'Williams Family'),
('HOU00000004', 'CHU00000001', 'Brown Family'),
('HOU00000005', 'CHU00000001', 'Jones Family'),
('HOU00000006', 'CHU00000001', 'Garcia Family'),
('HOU00000007', 'CHU00000001', 'Miller Family'),
('HOU00000008', 'CHU00000001', 'Davis Family'),
('HOU00000009', 'CHU00000001', 'Rodriguez Family'),
('HOU00000010', 'CHU00000001', 'Martinez Family'),
('HOU00000011', 'CHU00000001', 'Hernandez Family'),
('HOU00000012', 'CHU00000001', 'Lopez Family'),
('HOU00000013', 'CHU00000001', 'Gonzalez Family'),
('HOU00000014', 'CHU00000001', 'Wilson Family'),
('HOU00000015', 'CHU00000001', 'Anderson Family'),
('HOU00000016', 'CHU00000001', 'Thomas Family'),
('HOU00000017', 'CHU00000001', 'Taylor Family'),
('HOU00000018', 'CHU00000001', 'Moore Family'),
('HOU00000019', 'CHU00000001', 'Jackson Family'),
('HOU00000020', 'CHU00000001', 'Martin Family'),
('HOU00000021', 'CHU00000001', 'Lee Family'),
('HOU00000022', 'CHU00000001', 'Thompson Family'),
('HOU00000023', 'CHU00000001', 'White Family'),
('HOU00000024', 'CHU00000001', 'Harris Family'),
('HOU00000025', 'CHU00000001', 'Clark Family')
ON CONFLICT DO NOTHING;

-- Demo People (Sample of first 3 households to show structure - will add more in next edit)
INSERT INTO "people" ("id", "churchId", "displayName", "firstName", "middleName", "lastName", "prefix", "suffix", "gender", "maritalStatus", "birthDate", "email", "householdId", "householdRole", "membershipStatus", "homePhone", "mobilePhone", "workPhone", "address1", "city", "state", "zip", "removed") VALUES
-- Smith Family (Parents + 3 children)
('PER00000001', 'CHU00000001', 'John Smith', 'John', 'Robert', 'Smith', 'Mr.', NULL, 'Male', 'Married', '1975-06-15', 'john.smith@email.com', 'HOU00000001', 'Head', 'Member', '(217) 555-0101', '(217) 555-0102', '(217) 555-0103', '123 Oak Street', 'Springfield', 'IL', '62701', false),
('PER00000002', 'CHU00000001', 'Mary Smith', 'Mary', 'Elizabeth', 'Smith', 'Mrs.', NULL, 'Female', 'Married', '1978-03-22', 'mary.smith@email.com', 'HOU00000001', 'Spouse', 'Member', '(217) 555-0101', '(217) 555-0104', NULL, '123 Oak Street', 'Springfield', 'IL', '62701', false),
('PER00000003', 'CHU00000001', 'James Smith', 'James', 'William', 'Smith', NULL, NULL, 'Male', 'Single', '2005-11-08', 'james.smith@email.com', 'HOU00000001', 'Child', 'Member', '(217) 555-0101', '(217) 555-0105', NULL, '123 Oak Street', 'Springfield', 'IL', '62701', false),
('PER00000004', 'CHU00000001', 'Sarah Smith', 'Sarah', 'Marie', 'Smith', NULL, NULL, 'Female', 'Single', '2008-04-17', 'sarah.smith@email.com', 'HOU00000001', 'Child', 'Member', '(217) 555-0101', '(217) 555-0106', NULL, '123 Oak Street', 'Springfield', 'IL', '62701', false),
('PER00000005', 'CHU00000001', 'Michael Smith', 'Michael', 'Thomas', 'Smith', NULL, NULL, 'Male', 'Single', '2012-09-30', NULL, 'HOU00000001', 'Child', 'Member', '(217) 555-0101', NULL, NULL, '123 Oak Street', 'Springfield', 'IL', '62701', false),

-- Johnson Family (Parents + 2 children + 1 grandparent)
('PER00000006', 'CHU00000001', 'Robert Johnson', 'Robert', 'James', 'Johnson', 'Mr.', NULL, 'Male', 'Married', '1980-01-10', 'robert.johnson@email.com', 'HOU00000002', 'Head', 'Member', '(217) 555-0201', '(217) 555-0202', '(217) 555-0203', '456 Maple Avenue', 'Chatham', 'IL', '62629', false),
('PER00000007', 'CHU00000001', 'Patricia Johnson', 'Patricia', 'Ann', 'Johnson', 'Mrs.', NULL, 'Female', 'Married', '1982-07-25', 'patricia.johnson@email.com', 'HOU00000002', 'Spouse', 'Member', '(217) 555-0201', '(217) 555-0204', NULL, '456 Maple Avenue', 'Chatham', 'IL', '62629', false),
('PER00000008', 'CHU00000001', 'Elizabeth Johnson', 'Elizabeth', 'Grace', 'Johnson', NULL, NULL, 'Female', 'Single', '2010-12-03', NULL, 'HOU00000002', 'Child', 'Member', '(217) 555-0201', NULL, NULL, '456 Maple Avenue', 'Chatham', 'IL', '62629', false),
('PER00000009', 'CHU00000001', 'David Johnson', 'David', 'Michael', 'Johnson', NULL, NULL, 'Male', 'Single', '2014-05-19', NULL, 'HOU00000002', 'Child', 'Member', '(217) 555-0201', NULL, NULL, '456 Maple Avenue', 'Chatham', 'IL', '62629', false),
('PER00000010', 'CHU00000001', 'Margaret Johnson', 'Margaret', 'Louise', 'Johnson', 'Mrs.', NULL, 'Female', 'Widowed', '1955-08-14', 'margaret.johnson@email.com', 'HOU00000002', 'Other', 'Member', '(217) 555-0205', '(217) 555-0206', NULL, '456 Maple Avenue', 'Chatham', 'IL', '62629', false),

-- Williams Family (Single parent + 2 children)
('PER00000011', 'CHU00000001', 'Jennifer Williams', 'Jennifer', 'Lynn', 'Williams', 'Ms.', NULL, 'Female', 'Divorced', '1985-11-30', 'jennifer.williams@email.com', 'HOU00000003', 'Head', 'Member', '(217) 555-0301', '(217) 555-0302', '(217) 555-0303', '789 Pine Road', 'Rochester', 'IL', '62563', false),
('PER00000012', 'CHU00000001', 'Christopher Williams', 'Christopher', 'Allen', 'Williams', NULL, NULL, 'Male', 'Single', '2011-03-15', NULL, 'HOU00000003', 'Child', 'Member', '(217) 555-0301', NULL, NULL, '789 Pine Road', 'Rochester', 'IL', '62563', false),
('PER00000013', 'CHU00000001', 'Emma Williams', 'Emma', 'Rose', 'Williams', NULL, NULL, 'Female', 'Single', '2013-07-22', NULL, 'HOU00000003', 'Child', 'Member', '(217) 555-0301', NULL, NULL, '789 Pine Road', 'Rochester', 'IL', '62563', false),

-- Brown Family (Young married couple)
('PER00000014', 'CHU00000001', 'Daniel Brown', 'Daniel', 'Joseph', 'Brown', 'Mr.', NULL, 'Male', 'Married', '1992-04-18', 'daniel.brown@email.com', 'HOU00000004', 'Head', 'Member', '(217) 555-0401', '(217) 555-0402', '(217) 555-0403', '321 Cedar Lane', 'Springfield', 'IL', '62704', false),
('PER00000015', 'CHU00000001', 'Lisa Brown', 'Lisa', 'Marie', 'Brown', 'Mrs.', NULL, 'Female', 'Married', '1993-09-25', 'lisa.brown@email.com', 'HOU00000004', 'Spouse', 'Member', '(217) 555-0401', '(217) 555-0404', NULL, '321 Cedar Lane', 'Springfield', 'IL', '62704', false),

-- Jones Family (Blended family)
('PER00000016', 'CHU00000001', 'Thomas Jones', 'Thomas', 'Edward', 'Jones', 'Mr.', NULL, 'Male', 'Married', '1982-11-30', 'thomas.jones@email.com', 'HOU00000005', 'Head', 'Member', '(217) 555-0501', '(217) 555-0502', '(217) 555-0503', '654 Birch Court', 'Sherman', 'IL', '62684', false),
('PER00000017', 'CHU00000001', 'Rebecca Jones', 'Rebecca', 'Jean', 'Jones', 'Mrs.', NULL, 'Female', 'Married', '1984-05-12', 'rebecca.jones@email.com', 'HOU00000005', 'Spouse', 'Member', '(217) 555-0501', '(217) 555-0504', NULL, '654 Birch Court', 'Sherman', 'IL', '62684', false),
('PER00000018', 'CHU00000001', 'Matthew Jones', 'Matthew', 'David', 'Jones', NULL, NULL, 'Male', 'Single', '2007-08-15', NULL, 'HOU00000005', 'Child', 'Member', '(217) 555-0501', NULL, NULL, '654 Birch Court', 'Sherman', 'IL', '62684', false),
('PER00000019', 'CHU00000001', 'Sophia Jones', 'Sophia', 'Grace', 'Jones', NULL, NULL, 'Female', 'Single', '2010-02-28', NULL, 'HOU00000005', 'Child', 'Member', '(217) 555-0501', NULL, NULL, '654 Birch Court', 'Sherman', 'IL', '62684', false),
('PER00000020', 'CHU00000001', 'Ethan Smith', 'Ethan', 'James', 'Smith', NULL, NULL, 'Male', 'Single', '2009-11-03', NULL, 'HOU00000005', 'Child', 'Member', '(217) 555-0501', NULL, NULL, '654 Birch Court', 'Sherman', 'IL', '62684', false),

-- Garcia Family (Multi-generational)
('PER00000021', 'CHU00000001', 'Carlos Garcia', 'Carlos', 'Miguel', 'Garcia', 'Mr.', NULL, 'Male', 'Married', '1978-07-22', 'carlos.garcia@email.com', 'HOU00000006', 'Head', 'Member', '(217) 555-0601', '(217) 555-0602', '(217) 555-0603', '987 Walnut Street', 'Springfield', 'IL', '62703', false),
('PER00000022', 'CHU00000001', 'Maria Garcia', 'Maria', 'Isabel', 'Garcia', 'Mrs.', NULL, 'Female', 'Married', '1980-03-14', 'maria.garcia@email.com', 'HOU00000006', 'Spouse', 'Member', '(217) 555-0601', '(217) 555-0604', NULL, '987 Walnut Street', 'Springfield', 'IL', '62703', false),
('PER00000023', 'CHU00000001', 'Isabella Garcia', 'Isabella', 'Maria', 'Garcia', NULL, NULL, 'Female', 'Single', '2012-06-30', NULL, 'HOU00000006', 'Child', 'Member', '(217) 555-0601', NULL, NULL, '987 Walnut Street', 'Springfield', 'IL', '62703', false),
('PER00000024', 'CHU00000001', 'Antonio Garcia', 'Antonio', 'Jose', 'Garcia', 'Mr.', NULL, 'Male', 'Widowed', '1952-12-05', 'antonio.garcia@email.com', 'HOU00000006', 'Other', 'Member', '(217) 555-0605', '(217) 555-0606', NULL, '987 Walnut Street', 'Springfield', 'IL', '62703', false),

-- Miller Family (Empty nesters)
('PER00000025', 'CHU00000001', 'Richard Miller', 'Richard', 'Alan', 'Miller', 'Mr.', NULL, 'Male', 'Married', '1965-09-18', 'richard.miller@email.com', 'HOU00000007', 'Head', 'Member', '(217) 555-0701', '(217) 555-0702', '(217) 555-0703', '147 Spruce Drive', 'Riverton', 'IL', '62561', false),
('PER00000026', 'CHU00000001', 'Susan Miller', 'Susan', 'Kay', 'Miller', 'Mrs.', NULL, 'Female', 'Married', '1967-02-25', 'susan.miller@email.com', 'HOU00000007', 'Spouse', 'Member', '(217) 555-0701', '(217) 555-0704', NULL, '147 Spruce Drive', 'Riverton', 'IL', '62561', false),

-- Davis Family (Young family)
('PER00000027', 'CHU00000001', 'Michael Davis', 'Michael', 'James', 'Davis', 'Mr.', NULL, 'Male', 'Married', '1988-05-20', 'michael.davis@email.com', 'HOU00000008', 'Head', 'Member', '(217) 555-0801', '(217) 555-0802', '(217) 555-0803', '258 Elm Street', 'Williamsville', 'IL', '62693', false),
('PER00000028', 'CHU00000001', 'Emily Davis', 'Emily', 'Anne', 'Davis', 'Mrs.', NULL, 'Female', 'Married', '1989-11-15', 'emily.davis@email.com', 'HOU00000008', 'Spouse', 'Member', '(217) 555-0801', '(217) 555-0804', NULL, '258 Elm Street', 'Williamsville', 'IL', '62693', false),
('PER00000029', 'CHU00000001', 'Olivia Davis', 'Olivia', 'Grace', 'Davis', NULL, NULL, 'Female', 'Single', '2018-03-10', NULL, 'HOU00000008', 'Child', 'Member', '(217) 555-0801', NULL, NULL, '258 Elm Street', 'Williamsville', 'IL', '62693', false),
('PER00000030', 'CHU00000001', 'Noah Davis', 'Noah', 'James', 'Davis', NULL, NULL, 'Male', 'Single', '2020-07-22', NULL, 'HOU00000008', 'Child', 'Member', '(217) 555-0801', NULL, NULL, '258 Elm Street', 'Williamsville', 'IL', '62693', false),

-- Rodriguez Family (Single parent)
('PER00000031', 'CHU00000001', 'Sofia Rodriguez', 'Sofia', 'Maria', 'Rodriguez', 'Ms.', NULL, 'Female', 'Divorced', '1986-08-12', 'sofia.rodriguez@email.com', 'HOU00000009', 'Head', 'Member', '(217) 555-0901', '(217) 555-0902', '(217) 555-0903', '369 Ash Avenue', 'Springfield', 'IL', '62702', false),
('PER00000032', 'CHU00000001', 'Lucas Rodriguez', 'Lucas', 'Antonio', 'Rodriguez', NULL, NULL, 'Male', 'Single', '2013-04-25', NULL, 'HOU00000009', 'Child', 'Member', '(217) 555-0901', NULL, NULL, '369 Ash Avenue', 'Springfield', 'IL', '62702', false),
('PER00000033', 'CHU00000001', 'Mia Rodriguez', 'Mia', 'Isabella', 'Rodriguez', NULL, NULL, 'Female', 'Single', '2015-09-18', NULL, 'HOU00000009', 'Child', 'Member', '(217) 555-0901', NULL, NULL, '369 Ash Avenue', 'Springfield', 'IL', '62702', false),

-- Martinez Family (Senior couple)
('PER00000034', 'CHU00000001', 'Jose Martinez', 'Jose', 'Antonio', 'Martinez', 'Mr.', NULL, 'Male', 'Married', '1958-03-15', 'jose.martinez@email.com', 'HOU00000010', 'Head', 'Member', '(217) 555-1001', '(217) 555-1002', '(217) 555-1003', '741 Poplar Lane', 'Pawnee', 'IL', '62558', false),
('PER00000035', 'CHU00000001', 'Carmen Martinez', 'Carmen', 'Rosa', 'Martinez', 'Mrs.', NULL, 'Female', 'Married', '1960-07-28', 'carmen.martinez@email.com', 'HOU00000010', 'Spouse', 'Member', '(217) 555-1001', '(217) 555-1004', NULL, '741 Poplar Lane', 'Pawnee', 'IL', '62558', false),

-- Hernandez Family (Large family)
('PER00000036', 'CHU00000001', 'Miguel Hernandez', 'Miguel', 'Angel', 'Hernandez', 'Mr.', NULL, 'Male', 'Married', '1983-01-20', 'miguel.hernandez@email.com', 'HOU00000011', 'Head', 'Member', '(217) 555-1101', '(217) 555-1102', '(217) 555-1103', '852 Cherry Street', 'Springfield', 'IL', '62704', false),
('PER00000037', 'CHU00000001', 'Ana Hernandez', 'Ana', 'Maria', 'Hernandez', 'Mrs.', NULL, 'Female', 'Married', '1984-06-15', 'ana.hernandez@email.com', 'HOU00000011', 'Spouse', 'Member', '(217) 555-1101', '(217) 555-1104', NULL, '852 Cherry Street', 'Springfield', 'IL', '62704', false),
('PER00000038', 'CHU00000001', 'Diego Hernandez', 'Diego', 'Miguel', 'Hernandez', NULL, NULL, 'Male', 'Single', '2009-11-30', NULL, 'HOU00000011', 'Child', 'Member', '(217) 555-1101', NULL, NULL, '852 Cherry Street', 'Springfield', 'IL', '62704', false),
('PER00000039', 'CHU00000001', 'Valentina Hernandez', 'Valentina', 'Isabella', 'Hernandez', NULL, NULL, 'Female', 'Single', '2011-04-12', NULL, 'HOU00000011', 'Child', 'Member', '(217) 555-1101', NULL, NULL, '852 Cherry Street', 'Springfield', 'IL', '62704', false),
('PER00000040', 'CHU00000001', 'Gabriel Hernandez', 'Gabriel', 'Jose', 'Hernandez', NULL, NULL, 'Male', 'Single', '2014-08-25', NULL, 'HOU00000011', 'Child', 'Member', '(217) 555-1101', NULL, NULL, '852 Cherry Street', 'Springfield', 'IL', '62704', false),
('PER00000041', 'CHU00000001', 'Isabella Hernandez', 'Isabella', 'Maria', 'Hernandez', NULL, NULL, 'Female', 'Single', '2016-12-03', NULL, 'HOU00000011', 'Child', 'Member', '(217) 555-1101', NULL, NULL, '852 Cherry Street', 'Springfield', 'IL', '62704', false),

-- Lopez Family (Young professionals)
('PER00000042', 'CHU00000001', 'David Lopez', 'David', 'Robert', 'Lopez', 'Mr.', NULL, 'Male', 'Married', '1990-09-10', 'david.lopez@email.com', 'HOU00000012', 'Head', 'Member', '(217) 555-1201', '(217) 555-1202', '(217) 555-1203', '963 Magnolia Drive', 'Auburn', 'IL', '62615', false),
('PER00000043', 'CHU00000001', 'Laura Lopez', 'Laura', 'Elizabeth', 'Lopez', 'Mrs.', NULL, 'Female', 'Married', '1991-12-05', 'laura.lopez@email.com', 'HOU00000012', 'Spouse', 'Member', '(217) 555-1201', '(217) 555-1204', NULL, '963 Magnolia Drive', 'Auburn', 'IL', '62615', false),

-- Gonzalez Family (Multi-generational)
('PER00000044', 'CHU00000001', 'Roberto Gonzalez', 'Roberto', 'Carlos', 'Gonzalez', 'Mr.', NULL, 'Male', 'Married', '1975-04-18', 'roberto.gonzalez@email.com', 'HOU00000013', 'Head', 'Member', '(217) 555-1301', '(217) 555-1302', '(217) 555-1303', '159 Sycamore Road', 'Springfield', 'IL', '62703', false),
('PER00000045', 'CHU00000001', 'Elena Gonzalez', 'Elena', 'Maria', 'Gonzalez', 'Mrs.', NULL, 'Female', 'Married', '1977-08-22', 'elena.gonzalez@email.com', 'HOU00000013', 'Spouse', 'Member', '(217) 555-1301', '(217) 555-1304', NULL, '159 Sycamore Road', 'Springfield', 'IL', '62703', false),
('PER00000046', 'CHU00000001', 'Adriana Gonzalez', 'Adriana', 'Isabella', 'Gonzalez', NULL, NULL, 'Female', 'Single', '2010-03-15', NULL, 'HOU00000013', 'Child', 'Member', '(217) 555-1301', NULL, NULL, '159 Sycamore Road', 'Springfield', 'IL', '62703', false),
('PER00000047', 'CHU00000001', 'Fernando Gonzalez', 'Fernando', 'Jose', 'Gonzalez', NULL, NULL, 'Male', 'Single', '2012-07-28', NULL, 'HOU00000013', 'Child', 'Member', '(217) 555-1301', NULL, NULL, '159 Sycamore Road', 'Springfield', 'IL', '62703', false),
('PER00000048', 'CHU00000001', 'Rosa Gonzalez', 'Rosa', 'Maria', 'Gonzalez', 'Mrs.', NULL, 'Female', 'Widowed', '1950-11-30', 'rosa.gonzalez@email.com', 'HOU00000013', 'Other', 'Member', '(217) 555-1305', '(217) 555-1306', NULL, '159 Sycamore Road', 'Springfield', 'IL', '62703', false),

-- Wilson Family (Blended family)
('PER00000049', 'CHU00000001', 'James Wilson', 'James', 'William', 'Wilson', 'Mr.', NULL, 'Male', 'Married', '1981-06-25', 'james.wilson@email.com', 'HOU00000014', 'Head', 'Member', '(217) 555-1401', '(217) 555-1402', '(217) 555-1403', '357 Oakwood Avenue', 'Virden', 'IL', '62690', false),
('PER00000050', 'CHU00000001', 'Sarah Wilson', 'Sarah', 'Elizabeth', 'Wilson', 'Mrs.', NULL, 'Female', 'Married', '1983-02-14', 'sarah.wilson@email.com', 'HOU00000014', 'Spouse', 'Member', '(217) 555-1401', '(217) 555-1404', NULL, '357 Oakwood Avenue', 'Virden', 'IL', '62690', false),
('PER00000051', 'CHU00000001', 'Andrew Wilson', 'Andrew', 'James', 'Wilson', NULL, NULL, 'Male', 'Single', '2008-09-20', NULL, 'HOU00000014', 'Child', 'Member', '(217) 555-1401', NULL, NULL, '357 Oakwood Avenue', 'Virden', 'IL', '62690', false),
('PER00000052', 'CHU00000001', 'Emma Thompson', 'Emma', 'Marie', 'Thompson', NULL, NULL, 'Female', 'Single', '2011-05-12', NULL, 'HOU00000014', 'Child', 'Member', '(217) 555-1401', NULL, NULL, '357 Oakwood Avenue', 'Virden', 'IL', '62690', false),
('PER00000053', 'CHU00000001', 'Benjamin Wilson', 'Benjamin', 'Thomas', 'Wilson', NULL, NULL, 'Male', 'Single', '2014-11-30', NULL, 'HOU00000014', 'Child', 'Member', '(217) 555-1401', NULL, NULL, '357 Oakwood Avenue', 'Virden', 'IL', '62690', false),

-- Anderson Family (Senior with adult child)
('PER00000054', 'CHU00000001', 'William Anderson', 'William', 'Thomas', 'Anderson', 'Mr.', NULL, 'Male', 'Widowed', '1948-03-10', 'william.anderson@email.com', 'HOU00000015', 'Head', 'Member', '(217) 555-1501', '(217) 555-1502', NULL, '486 Pine Street', 'Springfield', 'IL', '62702', false),
('PER00000055', 'CHU00000001', 'Elizabeth Anderson', 'Elizabeth', 'Marie', 'Anderson', 'Ms.', NULL, 'Female', 'Single', '1975-08-15', 'elizabeth.anderson@email.com', 'HOU00000015', 'Child', 'Member', '(217) 555-1501', '(217) 555-1503', '(217) 555-1504', '486 Pine Street', 'Springfield', 'IL', '62702', false),

-- Thomas Family (Young family)
('PER00000056', 'CHU00000001', 'Christopher Thomas', 'Christopher', 'Michael', 'Thomas', 'Mr.', NULL, 'Male', 'Married', '1987-12-05', 'christopher.thomas@email.com', 'HOU00000016', 'Head', 'Member', '(217) 555-1601', '(217) 555-1602', '(217) 555-1603', '753 Cedar Court', 'Springfield', 'IL', '62704', false),
('PER00000057', 'CHU00000001', 'Amanda Thomas', 'Amanda', 'Jean', 'Thomas', 'Mrs.', NULL, 'Female', 'Married', '1989-04-18', 'amanda.thomas@email.com', 'HOU00000016', 'Spouse', 'Member', '(217) 555-1601', '(217) 555-1604', NULL, '753 Cedar Court', 'Springfield', 'IL', '62704', false),
('PER00000058', 'CHU00000001', 'Daniel Thomas', 'Daniel', 'James', 'Thomas', NULL, NULL, 'Male', 'Single', '2017-06-22', NULL, 'HOU00000016', 'Child', 'Member', '(217) 555-1601', NULL, NULL, '753 Cedar Court', 'Springfield', 'IL', '62704', false),
('PER00000059', 'CHU00000001', 'Sophia Thomas', 'Sophia', 'Marie', 'Thomas', NULL, NULL, 'Female', 'Single', '2019-09-15', NULL, 'HOU00000016', 'Child', 'Member', '(217) 555-1601', NULL, NULL, '753 Cedar Court', 'Springfield', 'IL', '62704', false),

-- Taylor Family (Single adult)
('PER00000060', 'CHU00000001', 'Jessica Taylor', 'Jessica', 'Marie', 'Taylor', 'Ms.', NULL, 'Female', 'Single', '1992-07-30', 'jessica.taylor@email.com', 'HOU00000017', 'Head', 'Member', '(217) 555-1701', '(217) 555-1702', '(217) 555-1703', '951 Maple Lane', 'Springfield', 'IL', '62703', false),

-- Moore Family (Empty nesters)
('PER00000061', 'CHU00000001', 'Robert Moore', 'Robert', 'James', 'Moore', 'Mr.', NULL, 'Male', 'Married', '1962-05-12', 'robert.moore@email.com', 'HOU00000018', 'Head', 'Member', '(217) 555-1801', '(217) 555-1802', '(217) 555-1803', '264 Birch Street', 'Springfield', 'IL', '62701', false),
('PER00000062', 'CHU00000001', 'Patricia Moore', 'Patricia', 'Ann', 'Moore', 'Mrs.', NULL, 'Female', 'Married', '1964-09-25', 'patricia.moore@email.com', 'HOU00000018', 'Spouse', 'Member', '(217) 555-1801', '(217) 555-1804', NULL, '264 Birch Street', 'Springfield', 'IL', '62701', false),

-- Jackson Family (Multi-generational)
('PER00000063', 'CHU00000001', 'Marcus Jackson', 'Marcus', 'Anthony', 'Jackson', 'Mr.', NULL, 'Male', 'Married', '1979-11-15', 'marcus.jackson@email.com', 'HOU00000019', 'Head', 'Member', '(217) 555-1901', '(217) 555-1902', '(217) 555-1903', '852 Walnut Court', 'Springfield', 'IL', '62704', false),
('PER00000064', 'CHU00000001', 'Nicole Jackson', 'Nicole', 'Marie', 'Jackson', 'Mrs.', NULL, 'Female', 'Married', '1981-03-28', 'nicole.jackson@email.com', 'HOU00000019', 'Spouse', 'Member', '(217) 555-1901', '(217) 555-1904', NULL, '852 Walnut Court', 'Springfield', 'IL', '62704', false),
('PER00000065', 'CHU00000001', 'Jordan Jackson', 'Jordan', 'Michael', 'Jackson', NULL, NULL, 'Male', 'Single', '2013-08-10', NULL, 'HOU00000019', 'Child', 'Member', '(217) 555-1901', NULL, NULL, '852 Walnut Court', 'Springfield', 'IL', '62704', false),
('PER00000066', 'CHU00000001', 'Grace Jackson', 'Grace', 'Elizabeth', 'Jackson', NULL, NULL, 'Female', 'Single', '2015-12-22', NULL, 'HOU00000019', 'Child', 'Member', '(217) 555-1901', NULL, NULL, '852 Walnut Court', 'Springfield', 'IL', '62704', false),
('PER00000067', 'CHU00000001', 'Dorothy Jackson', 'Dorothy', 'Jean', 'Jackson', 'Mrs.', NULL, 'Female', 'Widowed', '1953-06-18', 'dorothy.jackson@email.com', 'HOU00000019', 'Other', 'Member', '(217) 555-1905', '(217) 555-1906', NULL, '852 Walnut Court', 'Springfield', 'IL', '62704', false),

-- Martin Family (Young couple)
('PER00000068', 'CHU00000001', 'Kevin Martin', 'Kevin', 'James', 'Martin', 'Mr.', NULL, 'Male', 'Married', '1991-02-20', 'kevin.martin@email.com', 'HOU00000020', 'Head', 'Member', '(217) 555-2001', '(217) 555-2002', '(217) 555-2003', '147 Elm Avenue', 'Springfield', 'IL', '62702', false),
('PER00000069', 'CHU00000001', 'Rachel Martin', 'Rachel', 'Elizabeth', 'Martin', 'Mrs.', NULL, 'Female', 'Married', '1992-08-15', 'rachel.martin@email.com', 'HOU00000020', 'Spouse', 'Member', '(217) 555-2001', '(217) 555-2004', NULL, '147 Elm Avenue', 'Springfield', 'IL', '62702', false),

-- Lee Family (Single parent)
('PER00000070', 'CHU00000001', 'Michelle Lee', 'Michelle', 'Elizabeth', 'Lee', 'Ms.', NULL, 'Female', 'Divorced', '1984-10-05', 'michelle.lee@email.com', 'HOU00000021', 'Head', 'Member', '(217) 555-2101', '(217) 555-2102', '(217) 555-2103', '369 Pine Road', 'Springfield', 'IL', '62703', false),
('PER00000071', 'CHU00000001', 'Ryan Lee', 'Ryan', 'James', 'Lee', NULL, NULL, 'Male', 'Single', '2012-01-18', NULL, 'HOU00000021', 'Child', 'Member', '(217) 555-2101', NULL, NULL, '369 Pine Road', 'Springfield', 'IL', '62703', false),
('PER00000072', 'CHU00000001', 'Ava Lee', 'Ava', 'Marie', 'Lee', NULL, NULL, 'Female', 'Single', '2014-04-30', NULL, 'HOU00000021', 'Child', 'Member', '(217) 555-2101', NULL, NULL, '369 Pine Road', 'Springfield', 'IL', '62703', false),

-- Thompson Family (Senior couple)
('PER00000073', 'CHU00000001', 'George Thompson', 'George', 'William', 'Thompson', 'Mr.', NULL, 'Male', 'Married', '1956-07-22', 'george.thompson@email.com', 'HOU00000022', 'Head', 'Member', '(217) 555-2201', '(217) 555-2202', '(217) 555-2203', '582 Cedar Lane', 'Springfield', 'IL', '62701', false),
('PER00000074', 'CHU00000001', 'Margaret Thompson', 'Margaret', 'Ann', 'Thompson', 'Mrs.', NULL, 'Female', 'Married', '1958-12-15', 'margaret.thompson@email.com', 'HOU00000022', 'Spouse', 'Member', '(217) 555-2201', '(217) 555-2204', NULL, '582 Cedar Lane', 'Springfield', 'IL', '62701', false),

-- White Family (Young family)
('PER00000075', 'CHU00000001', 'Steven White', 'Steven', 'James', 'White', 'Mr.', NULL, 'Male', 'Married', '1986-03-10', 'steven.white@email.com', 'HOU00000023', 'Head', 'Member', '(217) 555-2301', '(217) 555-2302', '(217) 555-2303', '753 Oak Street', 'Springfield', 'IL', '62704', false),
('PER00000076', 'CHU00000001', 'Melissa White', 'Melissa', 'Marie', 'White', 'Mrs.', NULL, 'Female', 'Married', '1987-09-25', 'melissa.white@email.com', 'HOU00000023', 'Spouse', 'Member', '(217) 555-2301', '(217) 555-2304', NULL, '753 Oak Street', 'Springfield', 'IL', '62704', false),
('PER00000077', 'CHU00000001', 'Jacob White', 'Jacob', 'Thomas', 'White', NULL, NULL, 'Male', 'Single', '2016-05-18', NULL, 'HOU00000023', 'Child', 'Member', '(217) 555-2301', NULL, NULL, '753 Oak Street', 'Springfield', 'IL', '62704', false),
('PER00000078', 'CHU00000001', 'Madison White', 'Madison', 'Elizabeth', 'White', NULL, NULL, 'Female', 'Single', '2018-11-30', NULL, 'HOU00000023', 'Child', 'Member', '(217) 555-2301', NULL, NULL, '753 Oak Street', 'Springfield', 'IL', '62704', false),

-- Harris Family (Single adult)
('PER00000079', 'CHU00000001', 'Brian Harris', 'Brian', 'James', 'Harris', 'Mr.', NULL, 'Male', 'Single', '1993-04-15', 'brian.harris@email.com', 'HOU00000024', 'Head', 'Member', '(217) 555-2401', '(217) 555-2402', '(217) 555-2403', '951 Maple Court', 'Springfield', 'IL', '62702', false),

-- Clark Family (Empty nesters)
('PER00000080', 'CHU00000001', 'Donald Clark', 'Donald', 'James', 'Clark', 'Mr.', NULL, 'Male', 'Married', '1960-08-28', 'donald.clark@email.com', 'HOU00000025', 'Head', 'Member', '(217) 555-2501', '(217) 555-2502', '(217) 555-2503', '264 Birch Avenue', 'Springfield', 'IL', '62703', false),
('PER00000081', 'CHU00000001', 'Carol Clark', 'Carol', 'Marie', 'Clark', 'Mrs.', NULL, 'Female', 'Married', '1962-01-12', 'carol.clark@email.com', 'HOU00000025', 'Spouse', 'Member', '(217) 555-2501', '(217) 555-2504', NULL, '264 Birch Avenue', 'Springfield', 'IL', '62703', false)
ON CONFLICT DO NOTHING;

-- Notes for various people
INSERT INTO "notes" ("id", "churchId", "contentType", "contentId", "noteType", "addedBy", "createdAt", "contents", "updatedAt") VALUES
-- Pastoral Notes
('NOT00000001', 'CHU00000001', 'person', 'PER00000001', 'Pastoral', 'PER00000001', '2025-09-15 14:30:00', 'Met with John to discuss his interest in leading the men''s Bible study group. Very enthusiastic and well-prepared.', '2025-09-15 14:30:00'),
('NOT00000002', 'CHU00000001', 'person', 'PER00000031', 'Pastoral', 'PER00000001', '2025-10-01 10:15:00', 'Follow-up meeting with Sofia regarding her divorce support group participation. She''s making good progress and has been a great support to others.', '2025-10-01 10:15:00'),
('NOT00000003', 'CHU00000001', 'person', 'PER00000054', 'Pastoral', 'PER00000001', '2025-10-10 15:45:00', 'Home visit with William. Discussed his recent health concerns and arranged for meal delivery service.', '2025-10-10 15:45:00'),

-- Prayer Requests
('NOT00000004', 'CHU00000001', 'person', 'PER00000036', 'Prayer', 'PER00000036', '2025-10-15 09:00:00', 'Prayer request for Miguel''s job interview next week. Hoping for a position that would allow more time with family.', '2025-10-15 09:00:00'),
('NOT00000005', 'CHU00000001', 'person', 'PER00000070', 'Prayer', 'PER00000070', '2025-10-16 11:20:00', 'Michelle requested prayer for her children''s transition to new school district.', '2025-10-16 11:20:00'),
('NOT00000006', 'CHU00000001', 'person', 'PER00000021', 'Prayer', 'PER00000021', '2025-10-17 14:00:00', 'Carlos asked for prayer for his father Antonio''s upcoming surgery.', '2025-10-17 14:00:00'),

-- General Notes
('NOT00000007', 'CHU00000001', 'person', 'PER00000049', 'General', 'PER00000001', '2025-10-18 16:30:00', 'James expressed interest in volunteering for the youth ministry. Has experience working with teens.', '2025-10-18 16:30:00'),
('NOT00000008', 'CHU00000001', 'person', 'PER00000063', 'General', 'PER00000001', '2025-10-19 13:15:00', 'Marcus mentioned he''s available to help with the church''s tech setup. Has IT background.', '2025-10-19 13:15:00'),

-- Family Notes
('NOT00000009', 'CHU00000001', 'person', 'PER00000016', 'Family', 'PER00000001', '2025-10-20 10:00:00', 'Thomas and Rebecca''s family adjusting well to blended family situation. Kids getting along better.', '2025-10-20 10:00:00'),
('NOT00000010', 'CHU00000001', 'person', 'PER00000044', 'Family', 'PER00000001', '2025-10-21 11:45:00', 'Roberto''s mother Rosa moved in with family. All adjusting well to multi-generational living.', '2025-10-21 11:45:00'),

-- Ministry Notes
('NOT00000011', 'CHU00000001', 'person', 'PER00000027', 'Ministry', 'PER00000001', '2025-10-22 09:30:00', 'Michael interested in starting a young families small group. Good leadership potential.', '2025-10-22 09:30:00'),
('NOT00000012', 'CHU00000001', 'person', 'PER00000042', 'Ministry', 'PER00000001', '2025-10-23 14:20:00', 'David and Laura offered to help with the church''s social media presence.', '2025-10-23 14:20:00'),

-- Health Notes
('NOT00000013', 'CHU00000001', 'person', 'PER00000073', 'Health', 'PER00000001', '2025-10-24 15:00:00', 'George recovering well from knee surgery. Church meals team providing support.', '2025-10-24 15:00:00'),
('NOT00000014', 'CHU00000001', 'person', 'PER00000034', 'Health', 'PER00000001', '2025-10-25 10:30:00', 'Jose and Carmen both received flu shots. Reminder to check in during flu season.', '2025-10-25 10:30:00'),

-- Financial Notes
('NOT00000015', 'CHU00000001', 'person', 'PER00000068', 'Financial', 'PER00000001', '2025-10-26 11:00:00', 'Kevin and Rachel started tithing regularly. Very faithful in their giving.', '2025-10-26 11:00:00'),
('NOT00000016', 'CHU00000001', 'person', 'PER00000056', 'Financial', 'PER00000001', '2025-10-27 13:45:00', 'Christopher and Amanda received financial counseling. Working on budget plan.', '2025-10-27 13:45:00'),

-- Discipleship Notes
('NOT00000017', 'CHU00000001', 'person', 'PER00000079', 'Discipleship', 'PER00000001', '2025-10-28 09:15:00', 'Brian completed new members class. Interested in baptism.', '2025-10-28 09:15:00'),
('NOT00000018', 'CHU00000001', 'person', 'PER00000060', 'Discipleship', 'PER00000001', '2025-10-29 14:30:00', 'Jessica started leading a small group Bible study for young professionals.', '2025-10-29 14:30:00'),

-- Outreach Notes
('NOT00000019', 'CHU00000001', 'person', 'PER00000075', 'Outreach', 'PER00000001', '2025-11-01 10:45:00', 'Steven and Melissa volunteered for community food drive. Great community connections.', '2025-11-01 10:45:00'),
('NOT00000020', 'CHU00000001', 'person', 'PER00000061', 'Outreach', 'PER00000001', '2025-11-02 11:30:00', 'Robert and Patricia hosting neighborhood Bible study in their home.', '2025-11-02 11:30:00')
ON CONFLICT DO NOTHING;

INSERT INTO "groups" ("id", "churchId", "categoryName", "name", "trackAttendance", "parentPickup", "printNametag", "about", "meetingTime", "meetingLocation", "tags", "labels", "slug", "removed") VALUES
-- Ministries
('GRP0000000a', 'CHU00000001', '', 'Worship', true, false, true, 'Worship ministry volunteer scheduling', '', '', 'ministry', '', '', false),
('GRP0000000b', 'CHU00000001', 'GRP0000000a', 'Band Members', true, false, true, '', '', '', 'team', '', '', false),

-- Church Groups

-- Worship Services
('GRP00000001', 'CHU00000001', 'Worship', 'Sunday Morning Service', true, false, true, 'Our main Sunday worship service featuring contemporary worship and biblical teaching.', 'Sunday 10:00 AM', 'Main Sanctuary', 'standard', 'worship,service,main', 'sunday-morning', false),
('GRP00000002', 'CHU00000001', 'Worship', 'Sunday Evening Service', true, false, true, 'A more intimate evening service with traditional hymns and deeper Bible study.', 'Sunday 6:00 PM', 'Main Sanctuary', 'standard', 'worship,service,evening', 'sunday-evening', false),
('GRP00000003', 'CHU00000001', 'Worship', 'Wednesday Prayer Service', true, false, true, 'Midweek prayer and worship service focusing on intercessory prayer.', 'Wednesday 7:00 PM', 'Main Sanctuary', 'standard', 'worship,prayer,midweek', 'wednesday-prayer', false),

-- Sunday School Classes
('GRP00000004', 'CHU00000001', 'Sunday School', 'Adult Bible Class', true, false, true, 'In-depth Bible study for adults of all ages.', 'Sunday 9:00 AM', 'Room 101', 'standard', 'sunday-school,adult,bible-study', 'adult-bible-class', false),
('GRP00000005', 'CHU00000001', 'Sunday School', 'Young Adults Class', true, false, true, 'Bible study and fellowship for young adults (18-30).', 'Sunday 9:00 AM', 'Room 102', 'standard', 'sunday-school,young-adult,bible-study', 'young-adults-class', false),
('GRP00000006', 'CHU00000001', 'Sunday School', 'Senior Adults Class', true, false, true, 'Bible study and fellowship for senior adults.', 'Sunday 9:00 AM', 'Room 103', 'standard', 'sunday-school,senior,bible-study', 'senior-adults-class', false),

-- Children's Ministry
('GRP00000007', 'CHU00000001', 'Children', 'Nursery (0-2)', true, true, true, 'Loving care for our youngest members during services.', 'Sunday 9:00 AM', 'Nursery', 'standard', 'children,nursery,infant', 'nursery', false),
('GRP00000008', 'CHU00000001', 'Children', 'Preschool (3-5)', true, true, true, 'Age-appropriate Bible stories and activities for preschoolers.', 'Sunday 9:00 AM', 'Room 201', 'standard', 'children,preschool,bible', 'preschool', false),
('GRP00000009', 'CHU00000001', 'Children', 'Elementary (K-2)', true, true, true, 'Interactive Bible lessons and activities for early elementary.', 'Sunday 9:00 AM', 'Room 202', 'standard', 'children,elementary,bible', 'elementary-k2', false),
('GRP00000010', 'CHU00000001', 'Children', 'Elementary (3-5)', true, true, true, 'Bible lessons and activities for upper elementary.', 'Sunday 9:00 AM', 'Room 203', 'standard', 'children,elementary,bible', 'elementary-35', false),

-- Youth Ministry
('GRP00000011', 'CHU00000001', 'Youth', 'Middle School Youth', true, false, true, 'Bible study and activities for middle school students.', 'Sunday 9:00 AM', 'Youth Room', 'standard', 'youth,middle-school,bible-study', 'middle-school-youth', false),
('GRP00000012', 'CHU00000001', 'Youth', 'High School Youth', true, false, true, 'Bible study and activities for high school students.', 'Sunday 9:00 AM', 'Youth Room', 'standard', 'youth,high-school,bible-study', 'high-school-youth', false),
('GRP00000013', 'CHU00000001', 'Youth', 'Youth Group', true, false, true, 'Weekly youth group meeting with games, worship, and Bible study.', 'Wednesday 6:30 PM', 'Youth Room', 'standard', 'youth,group,weekly', 'youth-group', false),

-- Small Groups
('GRP00000014', 'CHU00000001', 'Small Groups', 'Young Families Group', true, false, true, 'Small group for families with young children.', 'Tuesday 7:00 PM', 'Various Homes', 'standard', 'small-group,family,young', 'young-families-group', false),
('GRP00000015', 'CHU00000001', 'Small Groups', 'Empty Nesters Group', true, false, true, 'Small group for couples whose children have left home.', 'Thursday 7:00 PM', 'Various Homes', 'standard', 'small-group,empty-nester', 'empty-nesters-group', false),
('GRP00000016', 'CHU00000001', 'Small Groups', 'Men''s Bible Study', true, false, true, 'Weekly Bible study and fellowship for men.', 'Saturday 7:00 AM', 'Fellowship Hall', 'standard', 'small-group,men,bible-study', 'mens-bible-study', false),
('GRP00000017', 'CHU00000001', 'Small Groups', 'Women''s Bible Study', true, false, true, 'Weekly Bible study and fellowship for women.', 'Tuesday 10:00 AM', 'Fellowship Hall', 'standard', 'small-group,women,bible-study', 'womens-bible-study', false),

-- Music Ministry
('GRP00000018', 'CHU00000001', 'Music', 'Adult Choir', true, false, true, 'Main worship choir for Sunday services.', 'Thursday 7:00 PM', 'Choir Room', 'standard', 'music,choir,adult', 'adult-choir', false),
('GRP00000019', 'CHU00000001', 'Music', 'Praise Team', true, false, true, 'Contemporary worship team for Sunday services.', 'Saturday 10:00 AM', 'Sanctuary', 'standard', 'music,praise,contemporary', 'praise-team', false),
('GRP00000020', 'CHU00000001', 'Music', 'Children''s Choir', true, true, true, 'Choir for children in grades 1-5.', 'Wednesday 4:00 PM', 'Choir Room', 'standard', 'music,children,choir', 'childrens-choir', false),

-- Outreach Ministry
('GRP00000021', 'CHU00000001', 'Outreach', 'Food Pantry Team', true, false, true, 'Volunteers who staff our community food pantry.', 'Saturday 9:00 AM', 'Food Pantry', 'standard', 'outreach,food-pantry,volunteer', 'food-pantry-team', false),
('GRP00000022', 'CHU00000001', 'Outreach', 'Missions Committee', true, false, true, 'Committee that oversees our local and global missions.', 'Monthly', 'Conference Room', 'standard', 'outreach,missions,committee', 'missions-committee', false),
('GRP00000023', 'CHU00000001', 'Outreach', 'Community Service Team', true, false, true, 'Volunteers who serve in various community projects.', 'Various', 'Various', 'standard', 'outreach,community,volunteer', 'community-service-team', false),

-- Special Ministries
('GRP00000024', 'CHU00000001', 'Special', 'Prayer Team', true, false, true, 'Team that prays for church and community needs.', 'Various', 'Prayer Room', 'standard', 'special,prayer,team', 'prayer-team', false),
('GRP00000025', 'CHU00000001', 'Special', 'Greeters Ministry', true, false, true, 'Team that welcomes visitors and members.', 'Sunday 9:30 AM', 'Main Entrance', 'standard', 'special,greeters,welcome', 'greeters-ministry', false),
('GRP00000026', 'CHU00000001', 'Special', 'Ushers Ministry', true, false, true, 'Team that assists with Sunday services.', 'Sunday 9:30 AM', 'Sanctuary', 'standard', 'special,ushers,service', 'ushers-ministry', false),

-- Support Groups
('GRP00000027', 'CHU00000001', 'Support', 'Divorce Care', true, false, true, 'Support group for those going through divorce.', 'Monday 7:00 PM', 'Room 104', 'standard', 'support,divorce,care', 'divorce-care', false),
('GRP00000028', 'CHU00000001', 'Support', 'Grief Support', true, false, true, 'Support group for those dealing with loss.', 'Tuesday 7:00 PM', 'Room 104', 'standard', 'support,grief,care', 'grief-support', false),
('GRP00000029', 'CHU00000001', 'Support', 'Financial Peace', true, false, true, 'Financial management course using Dave Ramsey''s principles.', 'Thursday 7:00 PM', 'Fellowship Hall', 'standard', 'support,financial,peace', 'financial-peace', false),

-- Special Events
('GRP00000030', 'CHU00000001', 'Events', 'Vacation Bible School', true, true, true, 'Annual summer program for children.', 'Summer', 'Various', 'standard', 'events,vbs,summer', 'vacation-bible-school', false)
ON CONFLICT DO NOTHING;

-- Group Memberships
INSERT INTO "groupMembers" ("id", "churchId", "groupId", "personId", "joinDate", "leader") VALUES
-- Worship Services (Everyone attends main service)
('GME00000001', 'CHU00000001', 'GRP00000001', 'PER00000001', '2024-01-01', true), -- John Smith (leader)
('GME00000002', 'CHU00000001', 'GRP00000001', 'PER00000002', '2024-01-01', false), -- Mary Smith
('GME00000003', 'CHU00000001', 'GRP00000001', 'PER00000003', '2024-01-01', false), -- James Smith
('GME00000004', 'CHU00000001', 'GRP00000001', 'PER00000004', '2024-01-01', false), -- Sarah Smith
('GME00000005', 'CHU00000001', 'GRP00000001', 'PER00000005', '2024-01-01', false), -- Michael Smith
-- Add more main service members...

-- Sunday School Classes
('GME00000006', 'CHU00000001', 'GRP00000004', 'PER00000001', '2024-01-01', true), -- John Smith (Adult Bible Class leader)
('GME00000007', 'CHU00000001', 'GRP00000004', 'PER00000002', '2024-01-01', false), -- Mary Smith
('GME00000008', 'CHU00000001', 'GRP00000004', 'PER00000025', '2024-01-01', false), -- Richard Miller
('GME00000009', 'CHU00000001', 'GRP00000004', 'PER00000026', '2024-01-01', false), -- Susan Miller
('GME00000010', 'CHU00000001', 'GRP00000005', 'PER00000027', '2024-01-01', true), -- Michael Davis (Young Adults leader)
('GME00000011', 'CHU00000001', 'GRP00000005', 'PER00000028', '2024-01-01', false), -- Emily Davis
('GME00000012', 'CHU00000001', 'GRP00000005', 'PER00000042', '2024-01-01', false), -- David Lopez
('GME00000013', 'CHU00000001', 'GRP00000005', 'PER00000043', '2024-01-01', false), -- Laura Lopez
('GME00000014', 'CHU00000001', 'GRP00000006', 'PER00000054', '2024-01-01', true), -- William Anderson (Senior Adults leader)
('GME00000015', 'CHU00000001', 'GRP00000006', 'PER00000073', '2024-01-01', false), -- George Thompson
('GME00000016', 'CHU00000001', 'GRP00000006', 'PER00000074', '2024-01-01', false), -- Margaret Thompson

-- Children's Ministry
('GME00000017', 'CHU00000001', 'GRP00000007', 'PER00000029', '2024-01-01', false), -- Olivia Davis (Nursery)
('GME00000018', 'CHU00000001', 'GRP00000007', 'PER00000030', '2024-01-01', false), -- Noah Davis (Nursery)
('GME00000019', 'CHU00000001', 'GRP00000008', 'PER00000032', '2024-01-01', false), -- Lucas Rodriguez (Preschool)
('GME00000020', 'CHU00000001', 'GRP00000008', 'PER00000033', '2024-01-01', false), -- Mia Rodriguez (Preschool)
('GME00000021', 'CHU00000001', 'GRP00000009', 'PER00000003', '2024-01-01', false), -- James Smith (Elementary K-2)
('GME00000022', 'CHU00000001', 'GRP00000009', 'PER00000004', '2024-01-01', false), -- Sarah Smith (Elementary K-2)
('GME00000023', 'CHU00000001', 'GRP00000010', 'PER00000038', '2024-01-01', false), -- Diego Hernandez (Elementary 3-5)
('GME00000024', 'CHU00000001', 'GRP00000010', 'PER00000039', '2024-01-01', false), -- Valentina Hernandez (Elementary 3-5)

-- Youth Ministry
('GME00000025', 'CHU00000001', 'GRP00000011', 'PER00000018', '2024-01-01', false), -- Matthew Jones (Middle School)
('GME00000026', 'CHU00000001', 'GRP00000011', 'PER00000019', '2024-01-01', false), -- Sophia Jones (Middle School)
('GME00000027', 'CHU00000001', 'GRP00000011', 'PER00000020', '2024-01-01', false), -- Ethan Smith (Middle School)
('GME00000028', 'CHU00000001', 'GRP00000012', 'PER00000051', '2024-01-01', false), -- Andrew Wilson (High School)
('GME00000029', 'CHU00000001', 'GRP00000012', 'PER00000052', '2024-01-01', false), -- Emma Thompson (High School)
('GME00000030', 'CHU00000001', 'GRP00000013', 'PER00000018', '2024-01-01', false), -- Matthew Jones (Youth Group)
('GME00000031', 'CHU00000001', 'GRP00000013', 'PER00000019', '2024-01-01', false), -- Sophia Jones (Youth Group)
('GME00000032', 'CHU00000001', 'GRP00000013', 'PER00000020', '2024-01-01', false), -- Ethan Smith (Youth Group)
('GME00000033', 'CHU00000001', 'GRP00000013', 'PER00000051', '2024-01-01', false), -- Andrew Wilson (Youth Group)
('GME00000034', 'CHU00000001', 'GRP00000013', 'PER00000052', '2024-01-01', false), -- Emma Thompson (Youth Group)

-- Small Groups
('GME00000035', 'CHU00000001', 'GRP00000014', 'PER00000027', '2024-01-01', true), -- Michael Davis (Young Families leader)
('GME00000036', 'CHU00000001', 'GRP00000014', 'PER00000028', '2024-01-01', false), -- Emily Davis
('GME00000037', 'CHU00000001', 'GRP00000014', 'PER00000056', '2024-01-01', false), -- Christopher Thomas
('GME00000038', 'CHU00000001', 'GRP00000014', 'PER00000057', '2024-01-01', false), -- Amanda Thomas
('GME00000039', 'CHU00000001', 'GRP00000015', 'PER00000025', '2024-01-01', true), -- Richard Miller (Empty Nesters leader)
('GME00000040', 'CHU00000001', 'GRP00000015', 'PER00000026', '2024-01-01', false), -- Susan Miller
('GME00000041', 'CHU00000001', 'GRP00000015', 'PER00000061', '2024-01-01', false), -- Robert Moore
('GME00000042', 'CHU00000001', 'GRP00000015', 'PER00000062', '2024-01-01', false), -- Patricia Moore
('GME00000043', 'CHU00000001', 'GRP00000016', 'PER00000001', '2024-01-01', true), -- John Smith (Men's Bible Study leader)
('GME00000044', 'CHU00000001', 'GRP00000016', 'PER00000016', '2024-01-01', false), -- Thomas Jones
('GME00000045', 'CHU00000001', 'GRP00000016', 'PER00000021', '2024-01-01', false), -- Carlos Garcia
('GME00000046', 'CHU00000001', 'GRP00000016', 'PER00000036', '2024-01-01', false), -- Miguel Hernandez
('GME00000047', 'CHU00000001', 'GRP00000017', 'PER00000002', '2024-01-01', true), -- Mary Smith (Women's Bible Study leader)
('GME00000048', 'CHU00000001', 'GRP00000017', 'PER00000017', '2024-01-01', false), -- Rebecca Jones
('GME00000049', 'CHU00000001', 'GRP00000017', 'PER00000022', '2024-01-01', false), -- Maria Garcia
('GME00000050', 'CHU00000001', 'GRP00000017', 'PER00000037', '2024-01-01', false), -- Ana Hernandez

-- Music Ministry
('GME00000051', 'CHU00000001', 'GRP00000018', 'PER00000002', '2024-01-01', true), -- Mary Smith (Adult Choir leader)
('GME00000052', 'CHU00000001', 'GRP00000018', 'PER00000017', '2024-01-01', false), -- Rebecca Jones
('GME00000053', 'CHU00000001', 'GRP00000018', 'PER00000022', '2024-01-01', false), -- Maria Garcia
('GME00000054', 'CHU00000001', 'GRP00000019', 'PER00000027', '2024-01-01', true), -- Michael Davis (Praise Team leader)
('GME00000055', 'CHU00000001', 'GRP00000019', 'PER00000028', '2024-01-01', false), -- Emily Davis
('GME00000056', 'CHU00000001', 'GRP00000019', 'PER00000042', '2024-01-01', false), -- David Lopez
('GME00000057', 'CHU00000001', 'GRP00000020', 'PER00000003', '2024-01-01', false), -- James Smith (Children's Choir)
('GME00000058', 'CHU00000001', 'GRP00000020', 'PER00000004', '2024-01-01', false), -- Sarah Smith (Children's Choir)
('GME00000059', 'CHU00000001', 'GRP00000020', 'PER00000038', '2024-01-01', false), -- Diego Hernandez (Children's Choir)
('GME00000060', 'CHU00000001', 'GRP00000020', 'PER00000039', '2024-01-01', false), -- Valentina Hernandez (Children's Choir)

-- Outreach Ministry
('GME00000061', 'CHU00000001', 'GRP00000021', 'PER00000016', '2024-01-01', true), -- Thomas Jones (Food Pantry leader)
('GME00000062', 'CHU00000001', 'GRP00000021', 'PER00000017', '2024-01-01', false), -- Rebecca Jones
('GME00000063', 'CHU00000001', 'GRP00000021', 'PER00000021', '2024-01-01', false), -- Carlos Garcia
('GME00000064', 'CHU00000001', 'GRP00000022', 'PER00000036', '2024-01-01', true), -- Miguel Hernandez (Missions leader)
('GME00000065', 'CHU00000001', 'GRP00000022', 'PER00000037', '2024-01-01', false), -- Ana Hernandez
('GME00000066', 'CHU00000001', 'GRP00000022', 'PER00000044', '2024-01-01', false), -- Roberto Gonzalez
('GME00000067', 'CHU00000001', 'GRP00000023', 'PER00000075', '2024-01-01', true), -- Steven White (Community Service leader)
('GME00000068', 'CHU00000001', 'GRP00000023', 'PER00000076', '2024-01-01', false), -- Melissa White
('GME00000069', 'CHU00000001', 'GRP00000023', 'PER00000061', '2024-01-01', false), -- Robert Moore

-- Special Ministries
('GME00000070', 'CHU00000001', 'GRP00000024', 'PER00000054', '2024-01-01', true), -- William Anderson (Prayer Team leader)
('GME00000071', 'CHU00000001', 'GRP00000024', 'PER00000073', '2024-01-01', false), -- George Thompson
('GME00000072', 'CHU00000001', 'GRP00000024', 'PER00000074', '2024-01-01', false), -- Margaret Thompson
('GME00000073', 'CHU00000001', 'GRP00000025', 'PER00000068', '2024-01-01', true), -- Kevin Martin (Greeters leader)
('GME00000074', 'CHU00000001', 'GRP00000025', 'PER00000069', '2024-01-01', false), -- Rachel Martin
('GME00000075', 'CHU00000001', 'GRP00000025', 'PER00000079', '2024-01-01', false), -- Brian Harris
('GME00000076', 'CHU00000001', 'GRP00000026', 'PER00000056', '2024-01-01', true), -- Christopher Thomas (Ushers leader)
('GME00000077', 'CHU00000001', 'GRP00000026', 'PER00000075', '2024-01-01', false), -- Steven White
('GME00000078', 'CHU00000001', 'GRP00000026', 'PER00000080', '2024-01-01', false), -- Donald Clark

-- Support Groups
('GME00000079', 'CHU00000001', 'GRP00000027', 'PER00000031', '2024-01-01', true), -- Sofia Rodriguez (Divorce Care leader)
('GME00000080', 'CHU00000001', 'GRP00000027', 'PER00000070', '2024-01-01', false), -- Michelle Lee
('GME00000081', 'CHU00000001', 'GRP00000028', 'PER00000073', '2024-01-01', true), -- George Thompson (Grief Support leader)
('GME00000082', 'CHU00000001', 'GRP00000028', 'PER00000074', '2024-01-01', false), -- Margaret Thompson
('GME00000083', 'CHU00000001', 'GRP00000029', 'PER00000056', '2024-01-01', true), -- Christopher Thomas (Financial Peace leader)
('GME00000084', 'CHU00000001', 'GRP00000029', 'PER00000057', '2024-01-01', false), -- Amanda Thomas
('GME00000085', 'CHU00000001', 'GRP00000029', 'PER00000068', '2024-01-01', false), -- Kevin Martin
('GME00000086', 'CHU00000001', 'GRP00000029', 'PER00000069', '2024-01-01', false), -- Rachel Martin

-- Special Events (VBS)
('GME00000087', 'CHU00000001', 'GRP00000030', 'PER00000003', '2024-01-01', false), -- James Smith
('GME00000088', 'CHU00000001', 'GRP00000030', 'PER00000004', '2024-01-01', false), -- Sarah Smith
('GME00000089', 'CHU00000001', 'GRP00000030', 'PER00000005', '2024-01-01', false), -- Michael Smith
('GME00000090', 'CHU00000001', 'GRP00000030', 'PER00000032', '2024-01-01', false), -- Lucas Rodriguez
('GME00000091', 'CHU00000001', 'GRP00000030', 'PER00000033', '2024-01-01', false), -- Mia Rodriguez
('GME00000092', 'CHU00000001', 'GRP00000030', 'PER00000038', '2024-01-01', false), -- Diego Hernandez
('GME00000093', 'CHU00000001', 'GRP00000030', 'PER00000039', '2024-01-01', false), -- Valentina Hernandez
('GME00000094', 'CHU00000001', 'GRP00000030', 'PER00000040', '2024-01-01', false), -- Gabriel Hernandez
('GME00000095', 'CHU00000001', 'GRP00000030', 'PER00000041', '2024-01-01', false)
ON CONFLICT DO NOTHING; -- Isabella Hernandez

-- Create Demo User
INSERT INTO "users" ("id", "email", "password", "displayName", "firstName", "lastName", "registrationDate") VALUES
('USR00000001', 'demo@b1.church', '$2a$10$qBWddIw2QMUlRrX9/6Cdz.nW.L5FqE45R1NTLF.V71LyhjY6I0lFu', 'Demo User', 'Demo', 'User', '2024-01-01 00:00:00')
ON CONFLICT DO NOTHING;

-- Create Domain Admin Role
INSERT INTO "roles" ("id", "churchId", "name") VALUES
('ROL00000001', 'CHU00000001', 'Domain Admins')
ON CONFLICT DO NOTHING;

-- Add Role Permissions
INSERT INTO "rolePermissions" ("id", "churchId", "roleId", "apiName", "contentType", "action") VALUES
('RPM00000001', 'CHU00000001', 'ROL00000001', 'MembershipApi', 'Domain', 'Admin')
ON CONFLICT DO NOTHING;

-- Add User to Role
INSERT INTO "roleMembers" ("id", "churchId", "roleId", "userId", "dateAdded") VALUES
('RME00000001', 'CHU00000001', 'ROL00000001', 'USR00000001', '2024-01-01 00:00:00')
ON CONFLICT DO NOTHING;

-- Create Demo User Person Record and Family
INSERT INTO "people" ("id", "churchId", "displayName", "firstName", "middleName", "lastName", "prefix", "suffix", "gender", "maritalStatus", "birthDate", "email", "householdId", "householdRole", "membershipStatus", "homePhone", "mobilePhone", "workPhone", "address1", "city", "state", "zip", "removed") VALUES
('PER00000082', 'CHU00000001', 'Demo User', 'Demo', NULL, 'User', 'Mr.', NULL, 'Male', 'Married', '1990-01-01', 'demo@b1.church', 'HOU00000026', 'Head', 'Member', '(217) 555-2601', '(217) 555-2602', '(217) 555-2603', '123 Demo Street', 'Springfield', 'IL', '62701', false),
('PER00000083', 'CHU00000001', 'Jane User', 'Jane', 'Marie', 'User', 'Mrs.', NULL, 'Female', 'Married', '1992-05-15', 'jane.user@email.com', 'HOU00000026', 'Spouse', 'Member', '(217) 555-2601', '(217) 555-2604', NULL, '123 Demo Street', 'Springfield', 'IL', '62701', false),
('PER00000084', 'CHU00000001', 'Alex User', 'Alex', 'James', 'User', NULL, NULL, 'Male', 'Single', '2015-08-20', NULL, 'HOU00000026', 'Child', 'Member', '(217) 555-2601', NULL, NULL, '123 Demo Street', 'Springfield', 'IL', '62701', false),
('PER00000085', 'CHU00000001', 'Emma User', 'Emma', 'Grace', 'User', NULL, NULL, 'Female', 'Single', '2018-03-12', NULL, 'HOU00000026', 'Child', 'Member', '(217) 555-2601', NULL, NULL, '123 Demo Street', 'Springfield', 'IL', '62701', false)
ON CONFLICT DO NOTHING;

-- Create Demo User Household
INSERT INTO "households" ("id", "churchId", "name") VALUES 
('HOU00000026', 'CHU00000001', 'User Family')
ON CONFLICT DO NOTHING;

-- Create userChurches record
INSERT INTO "userChurches" ("id", "userId", "churchId", "personId") VALUES
('UCH00000001', 'USR00000001', 'CHU00000001', 'PER00000082')
ON CONFLICT DO NOTHING;

-- Add Demo User Family to Groups
INSERT INTO "groupMembers" ("id", "churchId", "groupId", "personId", "joinDate", "leader") VALUES
-- Main worship service (whole family)
('GME00000096', 'CHU00000001', 'GRP00000001', 'PER00000082', '2024-01-01', false), -- Demo User
('GME00000121', 'CHU00000001', 'GRP00000001', 'PER00000083', '2024-01-01', false), -- Jane User
('GME00000122', 'CHU00000001', 'GRP00000001', 'PER00000084', '2024-01-01', false), -- Alex User
('GME00000123', 'CHU00000001', 'GRP00000001', 'PER00000085', '2024-01-01', false), -- Emma User
-- Adult Bible Class (parents)
('GME00000097', 'CHU00000001', 'GRP00000004', 'PER00000082', '2024-01-01', false), -- Demo User
('GME00000124', 'CHU00000001', 'GRP00000004', 'PER00000083', '2024-01-01', false), -- Jane User
-- Men's Bible Study
('GME00000098', 'CHU00000001', 'GRP00000016', 'PER00000082', '2024-01-01', false), -- Demo User
-- Women's Bible Study
('GME00000125', 'CHU00000001', 'GRP00000017', 'PER00000083', '2024-01-01', false), -- Jane User
-- Praise Team
('GME00000099', 'CHU00000001', 'GRP00000019', 'PER00000082', '2024-01-01', false), -- Demo User
('GME00000126', 'CHU00000001', 'GRP00000019', 'PER00000083', '2024-01-01', false), -- Jane User
-- Community Service Team
('GME00000100', 'CHU00000001', 'GRP00000023', 'PER00000082', '2024-01-01', false), -- Demo User
('GME00000127', 'CHU00000001', 'GRP00000023', 'PER00000083', '2024-01-01', false), -- Jane User
-- Young Families Group
('GME00000128', 'CHU00000001', 'GRP00000014', 'PER00000082', '2024-01-01', false), -- Demo User
('GME00000129', 'CHU00000001', 'GRP00000014', 'PER00000083', '2024-01-01', false), -- Jane User
-- Children's Ministry (Alex - Elementary 3-5)
('GME00000130', 'CHU00000001', 'GRP00000010', 'PER00000084', '2024-01-01', false), -- Alex User
-- Children's Ministry (Emma - Preschool)
('GME00000131', 'CHU00000001', 'GRP00000008', 'PER00000085', '2024-01-01', false), -- Emma User
-- Children's Choir (Alex)
('GME00000132', 'CHU00000001', 'GRP00000020', 'PER00000084', '2024-01-01', false), -- Alex User
-- VBS (both children)
('GME00000133', 'CHU00000001', 'GRP00000030', 'PER00000084', '2024-01-01', false), -- Alex User
('GME00000134', 'CHU00000001', 'GRP00000030', 'PER00000085', '2024-01-01', false)
ON CONFLICT DO NOTHING; -- Emma User

-- Add notes for the Demo User Family
INSERT INTO "notes" ("id", "churchId", "contentType", "contentId", "noteType", "addedBy", "createdAt", "contents", "updatedAt") VALUES
('NOT00000021', 'CHU00000001', 'person', 'PER00000082', 'General', 'PER00000001', '2025-11-01 12:00:00', 'Demo user account created for system testing and demonstrations.', '2025-11-01 12:00:00'),
('NOT00000022', 'CHU00000001', 'person', 'PER00000083', 'General', 'PER00000001', '2025-11-01 12:15:00', 'Jane is very active in women''s ministry and has a heart for worship.', '2025-11-01 12:15:00'),
('NOT00000023', 'CHU00000001', 'person', 'PER00000084', 'General', 'PER00000001', '2025-11-01 12:30:00', 'Alex is doing well in elementary Sunday school and loves to sing in children''s choir.', '2025-11-01 12:30:00'),
('NOT00000024', 'CHU00000001', 'person', 'PER00000085', 'General', 'PER00000001', '2025-11-01 12:45:00', 'Emma is a bright and energetic preschooler who enjoys Bible stories.', '2025-11-01 12:45:00')
ON CONFLICT DO NOTHING;

-- Band Members Group Assignments (20 adults)
INSERT INTO "groupMembers" ("id", "churchId", "groupId", "personId", "joinDate", "leader") VALUES
-- Band Leader
('GME00000101', 'CHU00000001', 'GRP0000000b', 'PER00000027', '2024-01-01', true), -- Michael Davis (Band Leader)
-- Vocalists
('GME00000102', 'CHU00000001', 'GRP0000000b', 'PER00000028', '2024-01-01', false), -- Emily Davis
('GME00000103', 'CHU00000001', 'GRP0000000b', 'PER00000002', '2024-01-01', false), -- Mary Smith
('GME00000104', 'CHU00000001', 'GRP0000000b', 'PER00000017', '2024-01-01', false), -- Rebecca Jones
('GME00000105', 'CHU00000001', 'GRP0000000b', 'PER00000043', '2024-01-01', false), -- Laura Lopez
-- Instrumentalists
('GME00000106', 'CHU00000001', 'GRP0000000b', 'PER00000001', '2024-01-01', false), -- John Smith (Guitar)
('GME00000107', 'CHU00000001', 'GRP0000000b', 'PER00000042', '2024-01-01', false), -- David Lopez (Bass)
('GME00000108', 'CHU00000001', 'GRP0000000b', 'PER00000016', '2024-01-01', false), -- Thomas Jones (Drums)
('GME00000109', 'CHU00000001', 'GRP0000000b', 'PER00000021', '2024-01-01', false), -- Carlos Garcia (Keyboard)
('GME00000110', 'CHU00000001', 'GRP0000000b', 'PER00000036', '2024-01-01', false), -- Miguel Hernandez (Guitar)
('GME00000111', 'CHU00000001', 'GRP0000000b', 'PER00000049', '2024-01-01', false), -- James Wilson (Drums)
('GME00000112', 'CHU00000001', 'GRP0000000b', 'PER00000056', '2024-01-01', false), -- Christopher Thomas (Bass)
('GME00000113', 'CHU00000001', 'GRP0000000b', 'PER00000063', '2024-01-01', false), -- Marcus Jackson (Keyboard)
('GME00000114', 'CHU00000001', 'GRP0000000b', 'PER00000068', '2024-01-01', false), -- Kevin Martin (Guitar)
('GME00000115', 'CHU00000001', 'GRP0000000b', 'PER00000075', '2024-01-01', false), -- Steven White (Drums)
-- Additional Vocalists and Support
('GME00000116', 'CHU00000001', 'GRP0000000b', 'PER00000022', '2024-01-01', false), -- Maria Garcia
('GME00000117', 'CHU00000001', 'GRP0000000b', 'PER00000037', '2024-01-01', false), -- Ana Hernandez
('GME00000118', 'CHU00000001', 'GRP0000000b', 'PER00000050', '2024-01-01', false), -- Sarah Wilson
('GME00000119', 'CHU00000001', 'GRP0000000b', 'PER00000057', '2024-01-01', false), -- Amanda Thomas
('GME00000120', 'CHU00000001', 'GRP0000000b', 'PER00000082', '2024-01-01', false)
ON CONFLICT DO NOTHING; -- Demo User

-- ========================================
-- Forms
-- ========================================
INSERT INTO "forms" ("id", "churchId", "name", "contentType", "createdTime", "modifiedTime", "restricted", "archived", "removed", "thankYouMessage") VALUES
('FRM00000001', 'CHU00000001', 'Visitor Information Card', 'person', '2025-06-01 10:00:00', '2025-06-01 10:00:00', false, false, false, 'Thank you for visiting Grace Community Church! We look forward to connecting with you.'),
('FRM00000002', 'CHU00000001', 'VBS Registration', 'group', '2025-07-01 10:00:00', '2025-07-01 10:00:00', false, false, false, 'Your child is registered for Vacation Bible School! You will receive a confirmation email.'),
('FRM00000003', 'CHU00000001', 'Small Group Interest Survey', 'group', '2025-08-15 10:00:00', '2025-08-15 10:00:00', false, false, false, 'Thanks for your interest in small groups! A group leader will reach out to you soon.')
ON CONFLICT DO NOTHING;

-- ========================================
-- Questions
-- ========================================
INSERT INTO "questions" ("id", "churchId", "formId", "parentId", "title", "description", "fieldType", "placeholder", "sort", "choices", "removed", "required") VALUES
-- Visitor Information Card
('QST00000001', 'CHU00000001', 'FRM00000001', NULL, 'First Name', NULL, 'textField', 'Enter first name', 1, NULL, false, true),
('QST00000002', 'CHU00000001', 'FRM00000001', NULL, 'Last Name', NULL, 'textField', 'Enter last name', 2, NULL, false, true),
('QST00000003', 'CHU00000001', 'FRM00000001', NULL, 'Email Address', NULL, 'textField', 'Enter email', 3, NULL, false, true),
('QST00000004', 'CHU00000001', 'FRM00000001', NULL, 'Phone Number', NULL, 'textField', 'Enter phone', 4, NULL, false, false),
('QST00000005', 'CHU00000001', 'FRM00000001', NULL, 'How did you hear about us?', NULL, 'dropdown', NULL, 5, 'Friend or Family,Online Search,Social Media,Drive By,Community Event,Other', false, false),
-- VBS Registration
('QST00000006', 'CHU00000001', 'FRM00000002', NULL, 'Child''s Full Name', NULL, 'textField', 'Enter child name', 1, NULL, false, true),
('QST00000007', 'CHU00000001', 'FRM00000002', NULL, 'Child''s Age', NULL, 'textField', 'Enter age', 2, NULL, false, true),
('QST00000008', 'CHU00000001', 'FRM00000002', NULL, 'Allergies or Special Needs', 'Please list any allergies or special needs we should know about.', 'textArea', NULL, 3, NULL, false, false),
('QST00000009', 'CHU00000001', 'FRM00000002', NULL, 'Emergency Contact Phone', NULL, 'textField', 'Enter phone', 4, NULL, false, true),
-- Small Group Interest Survey
('QST00000010', 'CHU00000001', 'FRM00000003', NULL, 'What day of the week works best?', NULL, 'dropdown', NULL, 1, 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday', false, true),
('QST00000011', 'CHU00000001', 'FRM00000003', NULL, 'What topics interest you most?', 'Select all that apply.', 'checkboxes', NULL, 2, 'Bible Study,Prayer,Fellowship,Community Service,Parenting,Marriage', false, false),
('QST00000012', 'CHU00000001', 'FRM00000003', NULL, 'Any additional comments?', NULL, 'textArea', 'Share your thoughts...', 3, NULL, false, false)
ON CONFLICT DO NOTHING;

-- ========================================
-- Form Submissions
-- ========================================
INSERT INTO "formSubmissions" ("id", "churchId", "formId", "contentType", "contentId", "submissionDate", "submittedBy") VALUES
('FSB00000001', 'CHU00000001', 'FRM00000001', 'person', 'PER00000079', '2025-09-15 10:30:00', 'PER00000079'),
('FSB00000002', 'CHU00000001', 'FRM00000001', 'person', 'PER00000060', '2025-09-22 11:00:00', 'PER00000060'),
('FSB00000003', 'CHU00000001', 'FRM00000002', 'group', 'GRP00000030', '2025-07-10 09:00:00', 'PER00000036'),
('FSB00000004', 'CHU00000001', 'FRM00000002', 'group', 'GRP00000030', '2025-07-12 14:30:00', 'PER00000027'),
('FSB00000005', 'CHU00000001', 'FRM00000003', 'group', 'GRP00000014', '2025-08-20 16:00:00', 'PER00000068')
ON CONFLICT DO NOTHING;

-- ========================================
-- Answers
-- ========================================
INSERT INTO "answers" ("id", "churchId", "formSubmissionId", "questionId", "value") VALUES
-- Brian Harris visitor card (FSB00000001)
('ANS00000001', 'CHU00000001', 'FSB00000001', 'QST00000001', 'Brian'),
('ANS00000002', 'CHU00000001', 'FSB00000001', 'QST00000002', 'Harris'),
('ANS00000003', 'CHU00000001', 'FSB00000001', 'QST00000003', 'brian.harris@email.com'),
('ANS00000004', 'CHU00000001', 'FSB00000001', 'QST00000004', '(217) 555-2402'),
('ANS00000005', 'CHU00000001', 'FSB00000001', 'QST00000005', 'Friend or Family'),
-- Jessica Taylor visitor card (FSB00000002)
('ANS00000006', 'CHU00000001', 'FSB00000002', 'QST00000001', 'Jessica'),
('ANS00000007', 'CHU00000001', 'FSB00000002', 'QST00000002', 'Taylor'),
('ANS00000008', 'CHU00000001', 'FSB00000002', 'QST00000003', 'jessica.taylor@email.com'),
('ANS00000009', 'CHU00000001', 'FSB00000002', 'QST00000005', 'Online Search'),
-- Miguel Hernandez VBS registration for Diego (FSB00000003)
('ANS00000010', 'CHU00000001', 'FSB00000003', 'QST00000006', 'Diego Hernandez'),
('ANS00000011', 'CHU00000001', 'FSB00000003', 'QST00000007', '8'),
('ANS00000012', 'CHU00000001', 'FSB00000003', 'QST00000008', 'No allergies'),
('ANS00000013', 'CHU00000001', 'FSB00000003', 'QST00000009', '(217) 555-1101'),
-- Michael Davis VBS registration (FSB00000004)
('ANS00000014', 'CHU00000001', 'FSB00000004', 'QST00000006', 'Olivia Davis'),
('ANS00000015', 'CHU00000001', 'FSB00000004', 'QST00000007', '7'),
('ANS00000016', 'CHU00000001', 'FSB00000004', 'QST00000008', 'Peanut allergy'),
('ANS00000017', 'CHU00000001', 'FSB00000004', 'QST00000009', '(217) 555-0801'),
-- Kevin Martin small group survey (FSB00000005)
('ANS00000018', 'CHU00000001', 'FSB00000005', 'QST00000010', 'Wednesday'),
('ANS00000019', 'CHU00000001', 'FSB00000005', 'QST00000011', 'Bible Study,Fellowship'),
('ANS00000020', 'CHU00000001', 'FSB00000005', 'QST00000012', 'We are new to the area and looking to build community.')
ON CONFLICT DO NOTHING;

-- ========================================
-- Visibility Preferences
-- ========================================
INSERT INTO "visibilityPreferences" ("id", "churchId", "personId", "address", "phoneNumber", "email") VALUES
('VIS00000001', 'CHU00000001', 'PER00000031', 'hidden', 'hidden', 'visible'),
('VIS00000002', 'CHU00000001', 'PER00000060', 'hidden', 'visible', 'visible'),
('VIS00000003', 'CHU00000001', 'PER00000079', 'visible', 'visible', 'hidden')
ON CONFLICT DO NOTHING;

-- Execute the stored procedure to populate demo data

-- Create stored procedure to reset demo data across all API databases  
    -- Reset demo data for MembershipApi
    
    -- Reset demo data for AttendanceApi
    
    -- Reset demo data for GivingApi
    
    -- Reset demo data for ContentApi
    
    -- Reset demo data for MessagingApi
    
    -- Reset demo data for DoingApi
