-- Destek taleplerinde uygulama adı, işletim sistemi ve e-posta onay belirteci
ALTER TABLE messages ADD COLUMN app_name TEXT DEFAULT NULL;
ALTER TABLE messages ADD COLUMN os_name TEXT DEFAULT NULL;
ALTER TABLE messages ADD COLUMN verification_token TEXT DEFAULT NULL;
