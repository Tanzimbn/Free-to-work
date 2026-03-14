-- Free-To-Work v2 — Bangladesh Upazilas Seed (key upazilas per district)
-- Run: psql $DATABASE_URL -f seeds/upazilas.sql
-- Note: Only major upazilas included. Full list can be expanded later.

INSERT INTO upazilas (id, district_id, name) VALUES
    -- Dhaka (district 1)
    (1001, 1, 'Dhanmondi'),
    (1002, 1, 'Gulshan'),
    (1003, 1, 'Mirpur'),
    (1004, 1, 'Mohammadpur'),
    (1005, 1, 'Tejgaon'),
    (1006, 1, 'Uttara'),
    (1007, 1, 'Demra'),
    (1008, 1, 'Badda'),
    (1009, 1, 'Khilgaon'),
    (1010, 1, 'Lalbagh'),

    -- Gazipur (district 2)
    (2001, 2, 'Gazipur Sadar'),
    (2002, 2, 'Tongi'),
    (2003, 2, 'Kaliakair'),
    (2004, 2, 'Kapasia'),
    (2005, 2, 'Sreepur'),

    -- Narayanganj (district 4)
    (4001, 4, 'Narayanganj Sadar'),
    (4002, 4, 'Araihazar'),
    (4003, 4, 'Rupganj'),
    (4004, 4, 'Sonargaon'),
    (4005, 4, 'Bandar'),

    -- Chittagong (district 14)
    (14001, 14, 'Chittagong Sadar'),
    (14002, 14, 'Pahartali'),
    (14003, 14, 'Panchlaish'),
    (14004, 14, 'Halishahar'),
    (14005, 14, 'Bayazid'),
    (14006, 14, 'Chandgaon'),
    (14007, 14, 'Kotwali'),
    (14008, 14, 'Anwara'),
    (14009, 14, 'Boalkhali'),
    (14010, 14, 'Fatikchhari'),
    (14011, 14, 'Hathazari'),
    (14012, 14, 'Mirsharai'),
    (14013, 14, 'Patiya'),
    (14014, 14, 'Rangunia'),
    (14015, 14, 'Raozan'),
    (14016, 14, 'Sandwip'),
    (14017, 14, 'Satkania'),
    (14018, 14, 'Sitakunda'),

    -- Cox''s Bazar (district 15)
    (15001, 15, 'Cox''s Bazar Sadar'),
    (15002, 15, 'Teknaf'),
    (15003, 15, 'Ukhia'),
    (15004, 15, 'Ramu'),

    -- Comilla (district 18)
    (18001, 18, 'Comilla Sadar'),
    (18002, 18, 'Brahmanbaria Sadar'),
    (18003, 18, 'Chandina'),
    (18004, 18, 'Chauddagram'),
    (18005, 18, 'Daudkandi'),

    -- Rajshahi (district 25)
    (25001, 25, 'Rajshahi Sadar'),
    (25002, 25, 'Boalia'),
    (25003, 25, 'Motihar'),
    (25004, 25, 'Paba'),
    (25005, 25, 'Bagha'),

    -- Khulna (district 33)
    (33001, 33, 'Khulna Sadar'),
    (33002, 33, 'Sonadanga'),
    (33003, 33, 'Khalishpur'),
    (33004, 33, 'Daulatpur'),
    (33005, 33, 'Batiaghata'),

    -- Barisal (district 43)
    (43001, 43, 'Barisal Sadar'),
    (43002, 43, 'Banaripara'),
    (43003, 43, 'Gaurnadi'),
    (43004, 43, 'Agailjhara'),
    (43005, 43, 'Bakerganj'),

    -- Sylhet (district 49)
    (49001, 49, 'Sylhet Sadar'),
    (49002, 49, 'Beanibazar'),
    (49003, 49, 'Bishwanath'),
    (49004, 49, 'Companiganj'),
    (49005, 49, 'Golapganj'),

    -- Rangpur (district 53)
    (53001, 53, 'Rangpur Sadar'),
    (53002, 53, 'Badarganj'),
    (53003, 53, 'Gangachara'),
    (53004, 53, 'Kaunia'),
    (53005, 53, 'Mithapukur'),

    -- Mymensingh (district 61)
    (61001, 61, 'Mymensingh Sadar'),
    (61002, 61, 'Trishal'),
    (61003, 61, 'Bhaluka'),
    (61004, 61, 'Muktagachha'),
    (61005, 61, 'Gaffargaon')
ON CONFLICT (id) DO NOTHING;
