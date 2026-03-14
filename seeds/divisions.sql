-- Free-To-Work v2 — Bangladesh Divisions Seed
-- Run: psql $DATABASE_URL -f seeds/divisions.sql

INSERT INTO divisions (id, name) VALUES
    (1, 'Dhaka'),
    (2, 'Chittagong'),
    (3, 'Rajshahi'),
    (4, 'Khulna'),
    (5, 'Barisal'),
    (6, 'Sylhet'),
    (7, 'Rangpur'),
    (8, 'Mymensingh')
ON CONFLICT (id) DO NOTHING;
