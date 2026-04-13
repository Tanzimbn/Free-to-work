-- Free-To-Work v2 — Bangladesh Districts Seed
-- Run: psql $DATABASE_URL -f seeds/districts.sql

INSERT INTO districts (id, division_id, name) VALUES
    -- Dhaka Division (1)
    (1,  1, 'Dhaka'),
    (2,  1, 'Gazipur'),
    (3,  1, 'Shariatpur'),
    (4,  1, 'Narayanganj'),
    (5,  1, 'Tangail'),
    (6,  1, 'Kishoreganj'),
    (7,  1, 'Manikganj'),
    (8,  1, 'Munshiganj'),
    (9,  1, 'Rajbari'),
    (10, 1, 'Madaripur'),
    (11, 1, 'Gopalganj'),
    (12, 1, 'Faridpur'),
    (13, 1, 'Narsingdi'),

    -- Chittagong Division (2)
    (14, 2, 'Chittagong'),
    (15, 2, 'Cox''s Bazar'),
    (16, 2, 'Rangamati'),
    (17, 2, 'Noakhali'),
    (18, 2, 'Comilla'),
    (19, 2, 'Feni'),
    (20, 2, 'Brahmanbaria'),
    (21, 2, 'Chandpur'),
    (22, 2, 'Lakshmipur'),
    (23, 2, 'Khagrachhari'),
    (24, 2, 'Bandarban'),

    -- Rajshahi Division (3)
    (25, 3, 'Rajshahi'),
    (26, 3, 'Chapainawabganj'),
    (27, 3, 'Natore'),
    (28, 3, 'Naogaon'),
    (29, 3, 'Pabna'),
    (30, 3, 'Sirajganj'),
    (31, 3, 'Joypurhat'),
    (32, 3, 'Bogura'),

    -- Khulna Division (4)
    (33, 4, 'Khulna'),
    (34, 4, 'Bagerhat'),
    (35, 4, 'Satkhira'),
    (36, 4, 'Jessore'),
    (37, 4, 'Magura'),
    (38, 4, 'Jhenaidah'),
    (39, 4, 'Narail'),
    (40, 4, 'Chuadanga'),
    (41, 4, 'Kushtia'),
    (42, 4, 'Meherpur'),

    -- Barisal Division (5)
    (43, 5, 'Barisal'),
    (44, 5, 'Patuakhali'),
    (45, 5, 'Bhola'),
    (46, 5, 'Pirojpur'),
    (47, 5, 'Barguna'),
    (48, 5, 'Jhalokati'),

    -- Sylhet Division (6)
    (49, 6, 'Sylhet'),
    (50, 6, 'Moulvibazar'),
    (51, 6, 'Habiganj'),
    (52, 6, 'Sunamganj'),

    -- Rangpur Division (7)
    (53, 7, 'Rangpur'),
    (54, 7, 'Dinajpur'),
    (55, 7, 'Nilphamari'),
    (56, 7, 'Gaibandha'),
    (57, 7, 'Thakurgaon'),
    (58, 7, 'Panchagarh'),
    (59, 7, 'Kurigram'),
    (60, 7, 'Lalmonirhat'),

    -- Mymensingh Division (8)
    (61, 8, 'Mymensingh'),
    (62, 8, 'Jamalpur'),
    (63, 8, 'Sherpur'),
    (64, 8, 'Netrokona')
ON CONFLICT (id) DO NOTHING;
