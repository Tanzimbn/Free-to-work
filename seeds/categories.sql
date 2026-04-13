-- Free-To-Work v2 — Category Seed Data
-- Run: psql $DATABASE_URL -f seeds/categories.sql

INSERT INTO categories (name, slug, is_active) VALUES
    ('Construction & Repair',   'construction', true),
    ('Electrical Work',         'electrical',   true),
    ('Plumbing',                'plumbing',     true),
    ('Cleaning & Housekeeping', 'cleaning',     true),
    ('IT & Technology',         'it-tech',      true),
    ('Design & Creative',       'design',       true),
    ('Writing & Translation',   'writing',      true),
    ('Tutoring & Education',    'tutoring',     true),
    ('Delivery & Transport',    'delivery',     true),
    ('Cooking & Catering',      'cooking',      true),
    ('Tailoring & Sewing',      'tailoring',    true),
    ('Gardening & Landscaping', 'gardening',    true),
    ('Security & Guard',        'security',     true),
    ('Healthcare & Caregiving', 'healthcare',   true),
    ('Other',                   'other',        true)
ON CONFLICT (slug) DO NOTHING;
