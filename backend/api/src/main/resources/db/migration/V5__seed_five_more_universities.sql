-- ─── Schools ─────────────────────────────────────────────────────────────────

INSERT INTO schools (id, name, slug, city, state, country, status) VALUES
    ('a1000000-0000-0000-0000-000000000005', 'Budapest University of Technology and Economics', 'bme',                    'Budapest', NULL, 'HU', 'ACTIVE'),
    ('a1000000-0000-0000-0000-000000000006', 'Semmelweis University',                           'semmelweis',             'Budapest', NULL, 'HU', 'ACTIVE'),
    ('a1000000-0000-0000-0000-000000000007', 'University of Szeged',                            'university-of-szeged',   'Szeged',   NULL, 'HU', 'ACTIVE'),
    ('a1000000-0000-0000-0000-000000000008', 'University of Miskolc',                           'university-of-miskolc',  'Miskolc',  NULL, 'HU', 'ACTIVE'),
    ('a1000000-0000-0000-0000-000000000009', 'Széchenyi István University',                     'szechenyi-istvan',       'Győr',     NULL, 'HU', 'ACTIVE');

-- ─── School email domains ─────────────────────────────────────────────────────

INSERT INTO school_domains (id, school_id, domain) VALUES
    ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005', 'edu.bme.hu'),
    ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000005', 'bme.hu'),
    ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000006', 'semmelweis.hu'),
    ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000006', 'stud.semmelweis.hu'),
    ('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000007', 'u-szeged.hu'),
    ('b1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000007', 'student.u-szeged.hu'),
    ('b1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000008', 'uni-miskolc.hu'),
    ('b1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000008', 'student.uni-miskolc.hu'),
    ('b1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000009', 'sze.hu'),
    ('b1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000009', 'hallgato.sze.hu');

-- ─── Dorms: Budapest University of Technology and Economics ──────────────────

INSERT INTO dorms (id, school_id, name, slug, address, description, status) VALUES
    (
        'c1000000-0000-0000-0005-000000000001',
        'a1000000-0000-0000-0000-000000000005',
        'Schönherz Zoltán Dormitory',
        'schonherz',
        'Irinyi József u. 42, Budapest, 1117',
        'The most iconic BME dormitory, famous for its vibrant student community and the legendary Schönherz Qpa festival — one of Hungary''s largest student events. Single and double rooms available; all utilities and internet included. Facilities include a cafeteria, gym, music practice rooms, multiple computer labs, and active student circles in robotics, electronics, and IT security.',
        'ACTIVE'
    );

INSERT INTO dorm_categories (dorm_id, category) VALUES
    ('c1000000-0000-0000-0005-000000000001', 'FRESHMAN'),
    ('c1000000-0000-0000-0005-000000000001', 'SOPHOMORE');

-- ─── Dorms: Semmelweis University ────────────────────────────────────────────

INSERT INTO dorms (id, school_id, name, slug, address, description, status) VALUES
    (
        'c1000000-0000-0000-0006-000000000001',
        'a1000000-0000-0000-0000-000000000006',
        'Kútvölgyi Dormitory',
        'kutvolgyi',
        'Kútvölgyi út 2, Budapest, 1125',
        'Nestled in the quiet Buda hills adjacent to the Kútvölgyi Clinical Center, this dormitory is the natural choice for Semmelweis medical and pharmacy students. Clean, well-maintained rooms with shared bathrooms, communal kitchens on each floor, dedicated study rooms, and a small gym. Direct bus connections link the dorm to all major faculties and the city centre.',
        'ACTIVE'
    );

INSERT INTO dorm_categories (dorm_id, category) VALUES
    ('c1000000-0000-0000-0006-000000000001', 'FRESHMAN'),
    ('c1000000-0000-0000-0006-000000000001', 'SOPHOMORE');

-- ─── Dorms: University of Szeged ─────────────────────────────────────────────

INSERT INTO dorms (id, school_id, name, slug, address, description, status) VALUES
    (
        'c1000000-0000-0000-0007-000000000001',
        'a1000000-0000-0000-0000-000000000007',
        'Apáthy István Dormitory',
        'apathy-istvan',
        'Eötvös u. 4, Szeged, 6720',
        'One of the largest and most central dormitories of the University of Szeged, located steps from the Tisza riverbank and named after the celebrated biologist István Apáthy. Renovated rooms with communal kitchens, study halls, a ground-floor café, and a student lounge. Tram lines stop nearby, connecting students to all faculties within minutes.',
        'ACTIVE'
    );

INSERT INTO dorm_categories (dorm_id, category) VALUES
    ('c1000000-0000-0000-0007-000000000001', 'FRESHMAN'),
    ('c1000000-0000-0000-0007-000000000001', 'SOPHOMORE');

-- ─── Dorms: University of Miskolc ────────────────────────────────────────────

INSERT INTO dorms (id, school_id, name, slug, address, description, status) VALUES
    (
        'c1000000-0000-0000-0008-000000000001',
        'a1000000-0000-0000-0000-000000000008',
        'Campus Dormitory',
        'miskolc-campus',
        'Miskolci Egyetem, Egyetemváros, Miskolc, 3515',
        'Situated on the University of Miskolc''s self-contained forested campus, this is the primary residence for students who enjoy a true campus-style university experience. All essential facilities — cafeteria, gym, sports hall, study rooms, and laundry — are within walking distance of every faculty building. A tranquil, community-oriented environment in northern Hungary.',
        'ACTIVE'
    );

INSERT INTO dorm_categories (dorm_id, category) VALUES
    ('c1000000-0000-0000-0008-000000000001', 'FRESHMAN'),
    ('c1000000-0000-0000-0008-000000000001', 'SOPHOMORE');

-- ─── Dorms: Széchenyi István University ──────────────────────────────────────

INSERT INTO dorms (id, school_id, name, slug, address, description, status) VALUES
    (
        'c1000000-0000-0000-0009-000000000001',
        'a1000000-0000-0000-0000-000000000009',
        'Universitas Dormitory',
        'universitas-gyor',
        'Áldozat u. 12, Győr, 9026',
        'Modern dormitory in the heart of Győr, walking distance from the main Széchenyi István University building and the beautifully preserved Baroque city centre. Fully furnished rooms with all utilities included, shared kitchens, a gym, study rooms, and a student lounge. Győr''s growing tech industry and the nearby Audi manufacturing complex make this an exciting city for engineering and business students.',
        'ACTIVE'
    );

INSERT INTO dorm_categories (dorm_id, category) VALUES
    ('c1000000-0000-0000-0009-000000000001', 'JUNIOR'),
    ('c1000000-0000-0000-0009-000000000001', 'SENIOR');
