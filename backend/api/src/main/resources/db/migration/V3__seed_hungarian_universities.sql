-- Schema: add description and address columns to dorms

ALTER TABLE dorms ADD COLUMN description TEXT;
ALTER TABLE dorms ADD COLUMN address     VARCHAR(255);

-- ─── Schools ─────────────────────────────────────────────────────────────────

INSERT INTO schools (id, name, slug, city, state, country, status) VALUES
    ('a1000000-0000-0000-0000-000000000001', 'Corvinus University of Budapest', 'corvinus',               'Budapest', NULL, 'HU', 'ACTIVE'),
    ('a1000000-0000-0000-0000-000000000002', 'ELTE Eötvös Loránd University',   'elte',                   'Budapest', NULL, 'HU', 'ACTIVE'),
    ('a1000000-0000-0000-0000-000000000003', 'University of Pécs',              'university-of-pecs',     'Pécs',     NULL, 'HU', 'ACTIVE'),
    ('a1000000-0000-0000-0000-000000000004', 'University of Debrecen',          'university-of-debrecen', 'Debrecen', NULL, 'HU', 'ACTIVE');

-- ─── School email domains ─────────────────────────────────────────────────────

INSERT INTO school_domains (id, school_id, domain) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'uni-corvinus.hu'),
    ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'elte.hu'),
    ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'student.elte.hu'),
    ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'pte.hu'),
    ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 'student.pte.hu'),
    ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000004', 'unideb.hu'),
    ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000004', 'student.unideb.hu');

-- ─── Dorms: Corvinus University of Budapest ───────────────────────────────────

INSERT INTO dorms (id, school_id, name, slug, address, description, status) VALUES
    (
        'c1000000-0000-0000-0001-000000000001',
        'a1000000-0000-0000-0000-000000000001',
        'Gellért Campus Kollégium',
        'gellert-campus',
        'Mányoki út 19-21, Budapest, 1118',
        'Modern dormitory perched on the scenic Gellért hillside with panoramic views of Budapest. Steps from the M4 metro and multiple tram lines for easy campus access. Features a ground-floor café, shared sports facilities, fully furnished rooms with WiFi, floor kitchens, and laundry facilities.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0001-000000000002',
        'a1000000-0000-0000-0000-000000000001',
        'Kinizsi Kollégium',
        'kinizsi',
        'Kinizsi utca 2-6, Budapest, 1092',
        'Situated on the Danube riverbank near the iconic Bálna building, Kinizsi Kollégium offers an unbeatable central Budapest location. Tram 2 stops right outside, connecting students to campus in minutes. Facilities include an outdoor sports field, gym (semester pass required), communal kitchens, and laundry.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0001-000000000003',
        'a1000000-0000-0000-0000-000000000001',
        'Ráday Kollégium',
        'raday',
        'Ráday utca 43-45, Budapest, 1092',
        'Located on the lively, restaurant-lined Ráday pedestrian street in the heart of Budapest''s social scene. Close to Kálvin tér metro station and well-served by trams. Described as a community centre for lifelong friendships — gym access included with a semester pass.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0001-000000000004',
        'a1000000-0000-0000-0000-000000000001',
        'Tarkaréti Kollégium',
        'tarkareti',
        'Nagysándor József utca 12, Budapest, 1191',
        'A quieter, more affordable option about 35–40 minutes from the main campus by bus, set in a green residential district. Good choice for students who prefer a calmer living environment. Facilities include a gym (semester pass required), communal kitchens, laundry, and WiFi.',
        'ACTIVE'
    );

INSERT INTO dorm_categories (dorm_id, category) VALUES
    ('c1000000-0000-0000-0001-000000000001', 'FRESHMAN'),
    ('c1000000-0000-0000-0001-000000000001', 'SOPHOMORE'),
    ('c1000000-0000-0000-0001-000000000002', 'SOPHOMORE'),
    ('c1000000-0000-0000-0001-000000000002', 'JUNIOR'),
    ('c1000000-0000-0000-0001-000000000003', 'JUNIOR'),
    ('c1000000-0000-0000-0001-000000000003', 'SENIOR'),
    ('c1000000-0000-0000-0001-000000000004', 'FRESHMAN');

-- ─── Dorms: ELTE Eötvös Loránd University ────────────────────────────────────

INSERT INTO dorms (id, school_id, name, slug, address, description, status) VALUES
    (
        'c1000000-0000-0000-0002-000000000001',
        'a1000000-0000-0000-0000-000000000002',
        'Ajtósi Dürer Dormitory',
        'ajtosi-durer',
        'Ajtósi Dürer sor 19-21, Budapest, 1146',
        'One of the most popular ELTE dormitories, located in the quiet 14th district. International students typically get 2-bed rooms with private bathrooms. All utilities — electricity, water, heating, and internet — are included in the monthly fee. Features kitchens with stoves and microwaves, a gym, washing machines, and regular community events.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0002-000000000002',
        'a1000000-0000-0000-0000-000000000002',
        'Kőrösi Csoma Sándor Dormitory',
        'korosi-csoma',
        'Kőrösi Csoma Sándor út 24, Budapest, 1116',
        'Named after the celebrated Hungarian orientalist, this dormitory offers well-furnished 2-bed rooms with refrigerators and fully equipped communal kitchens. All utilities are covered by the monthly fee. Study rooms, a gym, laundry facilities, and a lively programme of social events make it a great place to settle in.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0002-000000000003',
        'a1000000-0000-0000-0000-000000000002',
        'Márton Áron Dormitory',
        'marton-aron',
        'Ménesi út 11-13, Budapest, 1118',
        'A well-regarded ELTE residence with a strong community atmosphere. The programme includes movie clubs, tea houses, and board game nights. Fully furnished rooms with refrigerators; communal kitchens equipped with stoves, microwaves, and kettles on each floor. All utilities and internet included in the monthly fee.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0002-000000000004',
        'a1000000-0000-0000-0000-000000000002',
        'Nándorfejérvári úti Dormitory',
        'nandorfejervari',
        'Nándorfejérvári út 23, Budapest, 1117',
        'Modern ELTE dormitory on the Lágymányos campus, walking distance from the Faculty of Sciences and Faculty of Informatics. Comfortable furnished rooms with private bathrooms available for international students. Features a gym, laundry facilities, communal kitchens, and campus-wide WiFi. All utilities included.',
        'ACTIVE'
    );

INSERT INTO dorm_categories (dorm_id, category) VALUES
    ('c1000000-0000-0000-0002-000000000001', 'FRESHMAN'),
    ('c1000000-0000-0000-0002-000000000001', 'SOPHOMORE'),
    ('c1000000-0000-0000-0002-000000000002', 'SOPHOMORE'),
    ('c1000000-0000-0000-0002-000000000002', 'JUNIOR'),
    ('c1000000-0000-0000-0002-000000000003', 'JUNIOR'),
    ('c1000000-0000-0000-0002-000000000003', 'SENIOR'),
    ('c1000000-0000-0000-0002-000000000004', 'FRESHMAN'),
    ('c1000000-0000-0000-0002-000000000004', 'SOPHOMORE');

-- ─── Dorms: University of Pécs ───────────────────────────────────────────────

INSERT INTO dorms (id, school_id, name, slug, address, description, status) VALUES
    (
        'c1000000-0000-0000-0003-000000000001',
        'a1000000-0000-0000-0000-000000000003',
        'Szántó Dormitory',
        'szanto',
        'Szántó Kovács János u. 1/d, Pécs, 7633',
        'The largest University of Pécs dormitory, recently renovated with nicely furnished rooms and en-suite bathrooms. Wings A and C are the most modern. Internet is provided per room, and the complex includes study rooms, a student lounge, a cafeteria, bike storage, and parking. A great base for the first years in Pécs.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0003-000000000002',
        'a1000000-0000-0000-0000-000000000003',
        'Damjanich Dormitory',
        'damjanich',
        'Damjanich u. 30, Pécs, 7624',
        'Centrally located dormitory close to the Pécs city centre and several faculty buildings. Comfortable, well-maintained rooms with internet access. Facilities include study rooms, laundry, a communal lounge, and bike storage. Popular with second and third-year students who already know the city.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0003-000000000003',
        'a1000000-0000-0000-0000-000000000003',
        'Balassa Dormitory',
        'balassa',
        'Jakabhegyi út 6, Pécs, 7624',
        'Set in a quieter residential neighbourhood on Jakabhegyi út, Balassa is the most affordable University of Pécs dormitory. Ideal for students who prefer calm surroundings and easy access to the Szentágothai Research Centre. Amenities include internet, study rooms, a cafeteria, bike storage, and a student club area.',
        'ACTIVE'
    );

INSERT INTO dorm_categories (dorm_id, category) VALUES
    ('c1000000-0000-0000-0003-000000000001', 'FRESHMAN'),
    ('c1000000-0000-0000-0003-000000000001', 'SOPHOMORE'),
    ('c1000000-0000-0000-0003-000000000002', 'SOPHOMORE'),
    ('c1000000-0000-0000-0003-000000000002', 'JUNIOR'),
    ('c1000000-0000-0000-0003-000000000003', 'JUNIOR'),
    ('c1000000-0000-0000-0003-000000000003', 'SENIOR');

-- ─── Dorms: University of Debrecen ───────────────────────────────────────────

INSERT INTO dorms (id, school_id, name, slug, address, description, status) VALUES
    (
        'c1000000-0000-0000-0004-000000000001',
        'a1000000-0000-0000-0000-000000000004',
        'Kassai Campus Dormitory',
        'kassai',
        'Kassai út 26, Debrecen, 4028',
        'The largest student residential complex at the University of Debrecen, situated on the Kassai Campus. A full-service dormitory with an on-site cafeteria, gym, laundry facilities, internet in all rooms, study halls, and an active student club. The default choice for first and second-year students.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0004-000000000002',
        'a1000000-0000-0000-0000-000000000004',
        'Simonyi College',
        'simonyi-college',
        'Egyetem tér 1, Debrecen, 4032',
        'An elite specialised college for academically outstanding students. Beyond comfortable accommodation, residents take part in research seminars, workshops, and mentorship programmes that go well beyond regular coursework. Places are awarded competitively; the intellectually stimulating environment attracts the university''s top students.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0004-000000000003',
        'a1000000-0000-0000-0000-000000000004',
        'Nagyerdei Campus Dormitory',
        'nagyerdei',
        'Nagyerdei krt. 98, Debrecen, 4032',
        'Located next to the renowned Nagyerdő (Great Forest) park and close to the university''s medical and dental faculties. A peaceful, leafy setting popular with upper-year and postgraduate students. Facilities include furnished rooms, communal kitchens, laundry, internet, and easy tram access to the city centre.',
        'ACTIVE'
    ),
    (
        'c1000000-0000-0000-0004-000000000004',
        'a1000000-0000-0000-0000-000000000004',
        'Böszörményi úti Dormitory',
        'boszormenyi',
        'Böszörményi út 138, Debrecen, 4032',
        'Modern student housing on the agricultural and life sciences campus. Comfortable rooms with all utilities — electricity, water, heating, and internet — included in the monthly fee. Well connected to the city centre and main university buildings by public transport. A calm, student-friendly environment.',
        'ACTIVE'
    );

INSERT INTO dorm_categories (dorm_id, category) VALUES
    ('c1000000-0000-0000-0004-000000000001', 'FRESHMAN'),
    ('c1000000-0000-0000-0004-000000000001', 'SOPHOMORE'),
    ('c1000000-0000-0000-0004-000000000002', 'JUNIOR'),
    ('c1000000-0000-0000-0004-000000000002', 'SENIOR'),
    ('c1000000-0000-0000-0004-000000000003', 'SOPHOMORE'),
    ('c1000000-0000-0000-0004-000000000003', 'JUNIOR'),
    ('c1000000-0000-0000-0004-000000000004', 'FRESHMAN'),
    ('c1000000-0000-0000-0004-000000000004', 'SOPHOMORE');