-- ============================================================
-- SportsWear — Seed Data
-- Run schema.sql first, then this file.
-- Safe to re-run: all inserts use ON CONFLICT DO NOTHING.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PRODUCTS  (32 products across 5 brands)
-- ────────────────────────────────────────────────────────────
insert into products
  (id, title, brand, sport, gender, category, price, old_price, colors, sizes, images,
   description, long_description, specs, rating, reviews_count, badge, is_drop, in_stock)
values

-- ══════════════════════════════════════
-- NIKE  (7 products)
-- ══════════════════════════════════════

-- 1  Nike Air Zoom Pegasus 41  ─  Running / Men / Shoes
(
  '00000000-0000-0000-0000-000000000001',
  'Nike Air Zoom Pegasus 41',
  'Nike','Running','Men','Shoes',
  549.00, null,
  ARRAY['Black','White','Volt Green'],
  ARRAY['EU40','EU41','EU42','EU43','EU44','EU45'],
  ARRAY[
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop'
  ],
  'The trusted daily trainer, now lighter and more responsive than ever.',
  'The Nike Air Zoom Pegasus 41 keeps what runners love about the Peg — a secure, snappy ride — and makes it even better. The updated React foam midsole and forefoot Zoom Air unit deliver a cushioned yet energetic feel on every run.',
  '{"weight":"279g","drop":"10mm","type":"Road","upper":"Engineered mesh"}',
  4.7, 312, 'NEW', false, true
),

-- 2  Nike Dri-FIT ADV Top  ─  Gym / Men / Tops
(
  '00000000-0000-0000-0000-000000000002',
  'Nike Dri-FIT ADV TechKnit Ultra Top',
  'Nike','Gym','Men','Tops',
  279.00, 349.00,
  ARRAY['Black','White','Smoke Grey'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop'
  ],
  'Sweat-wicking training top engineered for high-intensity workouts.',
  'Nike Dri-FIT ADV technology wicks sweat and moves it to the fabric surface for faster evaporation. The knit fabric is strategically ventilated to keep you cool under pressure.',
  '{"fabric":"100% Polyester","fit":"Standard","technology":"Dri-FIT ADV"}',
  4.5, 188, 'SALE', false, true
),

-- 3  Nike Pro Women's Tights  ─  Yoga / Women / Bottoms
(
  '00000000-0000-0000-0000-000000000003',
  'Nike Pro Women''s 7/8 Tights',
  'Nike','Yoga','Women','Bottoms',
  329.00, null,
  ARRAY['Black','Plum','Navy'],
  ARRAY['XS','S','M','L','XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop'
  ],
  'Second-skin tights designed for yoga, pilates, and studio training.',
  'The Nike Pro Women''s 7/8 Tights feel like a second skin, thanks to the soft, stretchy fabric that moves with you in every direction. The high waistband provides coverage and support through every pose.',
  '{"fabric":"83% Polyester / 17% Spandex","rise":"High","length":"7/8"}',
  4.8, 241, 'BESTSELLER', false, true
),

-- 4  Nike Air Max 90  ─  Casual / Unisex / Shoes
(
  '00000000-0000-0000-0000-000000000004',
  'Nike Air Max 90',
  'Nike','Casual','Unisex','Shoes',
  649.00, null,
  ARRAY['White/Grey','Triple Black','University Red'],
  ARRAY['EU36','EU37','EU38','EU39','EU40','EU41','EU42','EU43','EU44','EU45'],
  ARRAY[
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop'
  ],
  'The icon that defined an era. Still turning heads after 30+ years.',
  'The Nike Air Max 90 stays true to its OG running roots with the classic Waffle outsole, stitched overlays and iconic Max Air cushioning. The result: pure, timeless icon status.',
  '{"cushioning":"Max Air","outsole":"Waffle","upper":"Leather/mesh"}',
  4.6, 534, null, false, true
),

-- 5  Nike Strike Football Jersey  ─  Football / Men / Tops
(
  '00000000-0000-0000-0000-000000000005',
  'Nike Strike Dri-FIT Football Jersey',
  'Nike','Football','Men','Tops',
  199.00, 299.00,
  ARRAY['Royal Blue','Red','Black'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop'
  ],
  'Match-ready football jersey with Dri-FIT sweat management.',
  'The Nike Strike Jersey is designed for the pitch. Dri-FIT technology keeps you dry as you attack, while the stretchy fabric gives you full range of motion when you go for goal.',
  '{"fabric":"100% Polyester","technology":"Dri-FIT","fit":"Standard"}',
  4.3, 97, 'SALE', false, true
),

-- 6  Nike Revolution 7 Kids  ─  Running / Kids / Shoes
(
  '00000000-0000-0000-0000-000000000006',
  'Nike Revolution 7 Kids',
  'Nike','Running','Kids','Shoes',
  299.00, null,
  ARRAY['Pink','Blue','Black/White'],
  ARRAY['EU28','EU29','EU30','EU31','EU32','EU33','EU34','EU35'],
  ARRAY[
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop'
  ],
  'Lightweight everyday sneaker built for active kids.',
  'The Nike Revolution 7 features a soft foam midsole that cushions every step while the slip-on design makes it easy for young athletes to get going fast.',
  '{"closure":"Slip-on","foam":"Soft foam","suitable_for":"School & Play"}',
  4.4, 156, null, false, true
),

-- 7  Nike Therma-FIT Jacket  ─  Gym / Men / Jackets  (DROP)
(
  '00000000-0000-0000-0000-000000000007',
  'Nike Therma-FIT Victory Training Jacket',
  'Nike','Gym','Men','Jackets',
  449.00, null,
  ARRAY['Black','Dark Grey','Army Green'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1556821840-3a63f15232d0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop'
  ],
  'Therma-FIT insulation keeps you warm during outdoor training sessions.',
  'The Nike Therma-FIT Victory Jacket uses synthetic insulation to lock in warmth without weighing you down. A zip-up front and adjustable hem lets you dial in your coverage as conditions change.',
  '{"insulation":"Therma-FIT","closure":"Full zip","pockets":"2 zip pockets"}',
  4.6, 73, 'EXCLUSIVE', true, true
),

-- ══════════════════════════════════════
-- ADIDAS  (7 products)
-- ══════════════════════════════════════

-- 8  Adidas Ultraboost 24  ─  Running / Men / Shoes
(
  '00000000-0000-0000-0000-000000000008',
  'Adidas Ultraboost 24',
  'Adidas','Running','Men','Shoes',
  699.00, null,
  ARRAY['Core Black','Cloud White','Solar Red'],
  ARRAY['EU40','EU41','EU42','EU43','EU44','EU45','EU46'],
  ARRAY[
    'https://images.unsplash.com/photo-1556906781-9d8a3276e6f0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop'
  ],
  'The iconic energy-return running shoe, reimagined for 2024.',
  'Experience an extraordinary energy return with every stride. The Ultraboost 24 features a BOOST midsole with 20% more cushioning than before, wrapped in an adaptive Primeknit+ upper.',
  '{"weight":"310g","drop":"10mm","midsole":"BOOST","upper":"Primeknit+"}',
  4.9, 621, 'BESTSELLER', false, true
),

-- 9  Adidas Tiro 24 Jersey  ─  Football / Men / Tops
(
  '00000000-0000-0000-0000-000000000009',
  'Adidas Tiro 24 Competition Match Jersey',
  'Adidas','Football','Men','Tops',
  229.00, null,
  ARRAY['Team Royal Blue','Black','Team Red'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop'
  ],
  'Match-ready performance jersey built for the beautiful game.',
  'Designed for competition, the Tiro 24 jersey uses AEROREADY technology to absorb moisture and keep you feeling fresh. The slim fit and ventilation panels keep you cool under pressure.',
  '{"technology":"AEROREADY","fit":"Slim","fabric":"100% Recycled Polyester"}',
  4.4, 143, null, false, true
),

-- 10  Adidas Adizero Shorts  ─  Running / Men / Bottoms
(
  '00000000-0000-0000-0000-000000000010',
  'Adidas Adizero Running Shorts',
  'Adidas','Running','Men','Bottoms',
  179.00, 249.00,
  ARRAY['Black','White','Vivid Red'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1539600830741-7dbaea5ccf3d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop'
  ],
  'Ultra-light race shorts designed to help you go faster.',
  'The Adidas Adizero Shorts are built for speed. Made from lightweight, moisture-wicking fabric with a split hem design for unrestricted movement on every run.',
  '{"weight":"65g","fabric":"100% Polyester","liner":"Built-in brief","length":"4 inch"}',
  4.3, 89, 'SALE', false, true
),

-- 11  Adidas Women''s Own the Run Jacket  ─  Running / Women / Jackets
(
  '00000000-0000-0000-0000-000000000011',
  'Adidas Women''s Own the Run Jacket',
  'Adidas','Running','Women','Jackets',
  399.00, null,
  ARRAY['Black','Legacy Purple','Halo Blue'],
  ARRAY['XS','S','M','L','XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f15232d0?w=800&auto=format&fit=crop'
  ],
  'Lightweight running jacket that packs down into its own pocket.',
  'Designed for outdoor running in unpredictable conditions. The Own the Run Jacket offers wind and light rain protection with a packable design that fits in your palm.',
  '{"packable":true,"wind_resistant":true,"fabric":"100% Recycled Polyester","reflective_details":true}',
  4.6, 112, 'NEW', false, true
),

-- 12  Adidas Stan Smith  ─  Casual / Unisex / Shoes
(
  '00000000-0000-0000-0000-000000000012',
  'Adidas Stan Smith Lux Shoes',
  'Adidas','Casual','Unisex','Shoes',
  499.00, null,
  ARRAY['Cloud White/Green','Cloud White/Navy','Core Black'],
  ARRAY['EU36','EU37','EU38','EU39','EU40','EU41','EU42','EU43','EU44','EU45'],
  ARRAY[
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop'
  ],
  'The most iconic tennis shoe ever made, elevated with premium materials.',
  'The Stan Smith has been an icon since its debut in the 70s. This Lux version features premium leather and a refined finish while maintaining the clean, minimal silhouette that made it famous.',
  '{"upper":"Premium leather","closure":"Lace-up","sole":"Rubber cupsole"}',
  4.7, 389, null, false, true
),

-- 13  Adidas Kids Predator  ─  Football / Kids / Shoes
(
  '00000000-0000-0000-0000-000000000013',
  'Adidas Kids'' Predator 24 Club FxG',
  'Adidas','Football','Kids','Shoes',
  249.00, null,
  ARRAY['Black/White','Solar Red/Black'],
  ARRAY['EU28','EU29','EU30','EU31','EU32','EU33','EU34','EU35'],
  ARRAY[
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop'
  ],
  'Entry-level Predator boots for young players who love control.',
  'Designed for developing players, the Predator 24 Club provides the grip and control kids need to take their game to the next level on firm and artificial ground.',
  '{"stud_type":"FxG","upper":"Synthetic","outsole":"Rubber","suitable_for":"Firm & artificial ground"}',
  4.2, 67, null, false, true
),

-- 14  Adidas Yoga Studio Leggings  ─  Yoga / Women / Bottoms
(
  '00000000-0000-0000-0000-000000000014',
  'Adidas Yoga Studio Flare Leggings',
  'Adidas','Yoga','Women','Bottoms',
  299.00, null,
  ARRAY['Black','Magic Mauve','Halo Ivory'],
  ARRAY['XS','S','M','L','XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop'
  ],
  'Soft studio leggings with a wide waistband and flared hem.',
  'These yoga flare leggings are made from soft, 4-way stretch fabric that moves with you in every pose. The wide waistband stays put, and the flared hem gives a stylish studio look.',
  '{"fabric":"88% Polyester / 12% Elastane","rise":"High","style":"Flare","waistband":"Wide"}',
  4.7, 198, 'BESTSELLER', false, true
),

-- ══════════════════════════════════════
-- PUMA  (6 products)
-- ══════════════════════════════════════

-- 15  Puma Velocity Nitro 3  ─  Running / Men / Shoes
(
  '00000000-0000-0000-0000-000000000015',
  'Puma Velocity Nitro 3',
  'Puma','Running','Men','Shoes',
  499.00, null,
  ARRAY['Black/Gold','White/Blue','Lime Squeeze'],
  ARRAY['EU40','EU41','EU42','EU43','EU44','EU45'],
  ARRAY[
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556906781-9d8a3276e6f0?w=800&auto=format&fit=crop'
  ],
  'High-energy daily trainer with NITRO foam for a springy ride.',
  'The Velocity Nitro 3 uses PUMA''s lightest and most responsive NITRO foam to deliver a snappy, energetic ride for daily training runs and tempo workouts.',
  '{"midsole":"NITRO foam","weight":"265g","drop":"8mm","upper":"Engineered mesh"}',
  4.5, 134, 'NEW', false, true
),

-- 16  Puma Fit Woven Jacket  ─  Gym / Men / Jackets
(
  '00000000-0000-0000-0000-000000000016',
  'Puma Fit Woven Training Jacket',
  'Puma','Gym','Men','Jackets',
  349.00, 449.00,
  ARRAY['Black','Dark Navy','Concrete Grey'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1556821840-3a63f15232d0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop'
  ],
  'Woven training jacket with dryCELL moisture management.',
  'The Puma Fit Woven Jacket features dryCELL technology to keep you dry and focused during intense gym sessions. The lightweight woven fabric provides wind protection without bulk.',
  '{"technology":"dryCELL","closure":"Full zip","pockets":"2 hand pockets + 1 chest pocket"}',
  4.4, 88, null, false, true
),

-- 17  Puma Studio Foundation Bra  ─  Yoga / Women / Accessories
(
  '00000000-0000-0000-0000-000000000017',
  'Puma Women''s Studio Foundation Bra',
  'Puma','Yoga','Women','Accessories',
  149.00, null,
  ARRAY['Black','Wild Willow','Electric Orchid'],
  ARRAY['XS','S','M','L','XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
  ],
  'Low-impact studio bra with soft support for yoga and pilates.',
  'Designed for low-impact activities like yoga and pilates, this bra provides soft support with removable cups and a cross-back design for a secure, comfortable fit.',
  '{"support":"Low impact","removable_cups":true,"closure":"Pull-on","fabric":"92% Polyester / 8% Elastane"}',
  4.6, 211, null, false, true
),

-- 18  Puma Future 7 Pro  ─  Football / Men / Shoes  (DROP)
(
  '00000000-0000-0000-0000-000000000018',
  'Puma Future 7 Pro FG/AG',
  'Puma','Football','Men','Shoes',
  549.00, null,
  ARRAY['Yellow/Black','Blue/White','Black/Gold'],
  ARRAY['EU40','EU41','EU42','EU43','EU44','EU45'],
  ARRAY[
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop'
  ],
  'Elite football boots with adaptive FUZIONFIT+ compression bandage.',
  'The Future 7 Pro features the FUZIONFIT+ compression bandage for an adaptive, sock-like fit. The grippy MG outsole provides traction across firm and artificial ground.',
  '{"stud_type":"FG/AG","upper":"FUZIONFIT+ bandage","outsole":"MG stud configuration","suitable_for":"Firm & artificial ground"}',
  4.8, 92, 'EXCLUSIVE', true, true
),

-- 19  Puma Essentials Sweatshirt  ─  Casual / Unisex / Tops
(
  '00000000-0000-0000-0000-000000000019',
  'Puma Essentials+ Tape Sweatshirt',
  'Puma','Casual','Unisex','Tops',
  229.00, null,
  ARRAY['Black','Puma White','Club Red'],
  ARRAY['XS','S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop'
  ],
  'Classic fleece sweatshirt with Puma tape branding detail.',
  'A wardrobe staple with a sporty edge. The Essentials+ Tape Sweatshirt is made from soft fleece fabric with a regular fit and the signature Puma tape running down the sleeve.',
  '{"fabric":"65% Cotton / 35% Polyester","fit":"Regular","style":"Crew neck"}',
  4.3, 176, null, false, true
),

-- 20  Puma Fit 5'' Short  ─  Gym / Men / Bottoms
(
  '00000000-0000-0000-0000-000000000020',
  'Puma Fit 5" Woven Short',
  'Puma','Gym','Men','Bottoms',
  159.00, 219.00,
  ARRAY['Black','Navy','Lime Squeeze'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1539600830741-7dbaea5ccf3d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop'
  ],
  'Lightweight woven gym shorts with dryCELL moisture management.',
  'Built for intense gym sessions, these woven training shorts feature dryCELL technology to wick moisture away from your skin. An internal brief and side pockets add function.',
  '{"technology":"dryCELL","inseam":"5 inch","liner":"Internal brief","pockets":"2 side pockets"}',
  4.2, 64, 'SALE', false, true
),

-- ══════════════════════════════════════
-- UNDER ARMOUR  (6 products)
-- ══════════════════════════════════════

-- 21  UA HOVR Sonic 6  ─  Running / Men / Shoes
(
  '00000000-0000-0000-0000-000000000021',
  'Under Armour HOVR Sonic 6',
  'Under Armour','Running','Men','Shoes',
  529.00, null,
  ARRAY['Black','White/Red','Midnight Navy'],
  ARRAY['EU40','EU41','EU42','EU43','EU44','EU45'],
  ARRAY[
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop'
  ],
  'Connected running shoe that tracks your metrics with every stride.',
  'UA HOVR technology provides a "zero gravity feel" to maintain energy return. The connected sensor tracks your running form and cadence, syncing with the MapMyRun app for real-time coaching.',
  '{"midsole":"UA HOVR","weight":"285g","drop":"8mm","connected":true,"app":"MapMyRun"}',
  4.6, 287, 'BESTSELLER', false, true
),

-- 22  UA HeatGear Compression Shirt  ─  Gym / Men / Tops
(
  '00000000-0000-0000-0000-000000000022',
  'Under Armour HeatGear Armour Compression Shirt',
  'Under Armour','Gym','Men','Tops',
  199.00, null,
  ARRAY['Black','White','Red'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop'
  ],
  'Ultra-tight compression shirt that keeps you cool and supported.',
  'HeatGear fabric is ultra-light and works to wick sweat and dry fast, while the 4-way stretch construction moves with you. The anti-odor technology prevents the growth of odor-causing microbes.',
  '{"technology":"HeatGear","fit":"Compression","anti_odor":true,"fabric":"84% Polyester / 16% Elastane"}',
  4.5, 319, null, false, true
),

-- 23  UA Women''s Rush SmartForm Bra  ─  Gym / Women / Accessories  (DROP)
(
  '00000000-0000-0000-0000-000000000023',
  'Under Armour Women''s Rush SmartForm Bra',
  'Under Armour','Gym','Women','Accessories',
  179.00, null,
  ARRAY['Black','Pink Quartz','Midnight Navy'],
  ARRAY['XS','S','M','L','XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop'
  ],
  'High-impact sports bra with UA Rush technology for energy return.',
  'UA RUSH fabric is embedded with minerals that absorb the energy your body naturally emits and reflect it back to your muscles for enhanced performance. This high-support bra is designed for high-intensity workouts.',
  '{"support":"High impact","technology":"UA RUSH","closure":"Racerback","removable_cups":true}',
  4.7, 145, 'NEW', true, true
),

-- 24  UA Phantom 3 SE Women  ─  Running / Women / Shoes
(
  '00000000-0000-0000-0000-000000000024',
  'Under Armour Phantom 3 SE Running Shoes',
  'Under Armour','Running','Women','Shoes',
  479.00, null,
  ARRAY['Halo Grey','Pink Elixir','Black'],
  ARRAY['EU36','EU37','EU38','EU39','EU40','EU41'],
  ARRAY[
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop'
  ],
  'Women''s performance runner with UA FLOW cushioning.',
  'The Phantom 3 SE features a UA FLOW midsole that provides a lightweight, responsive feel with every step. The wider fit and breathable upper make it ideal for longer runs.',
  '{"midsole":"UA FLOW","weight":"252g","drop":"8mm","upper":"Warp knit mesh"}',
  4.4, 198, null, false, true
),

-- 25  UA Storm Fleece Hoodie  ─  Gym / Men / Jackets
(
  '00000000-0000-0000-0000-000000000025',
  'Under Armour Storm Fleece Full Zip Hoodie',
  'Under Armour','Gym','Men','Jackets',
  379.00, 499.00,
  ARRAY['Black','Pitch Grey','Academy Blue'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f15232d0?w=800&auto=format&fit=crop'
  ],
  'Water-resistant fleece hoodie built for outdoor training.',
  'UA Storm technology repels water without sacrificing breathability. The brushed fleece interior traps heat while the exterior handles whatever the weather throws at you.',
  '{"technology":"UA Storm","closure":"Full zip","pockets":"Kangaroo pocket + 2 zip pockets","water_resistant":true}',
  4.5, 102, 'SALE', false, true
),

-- 26  UA Launch Shorts  ─  Running / Men / Bottoms
(
  '00000000-0000-0000-0000-000000000026',
  'Under Armour Launch Elite 5'' Shorts',
  'Under Armour','Running','Men','Bottoms',
  189.00, null,
  ARRAY['Black','White','Neon Coral'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539600830741-7dbaea5ccf3d?w=800&auto=format&fit=crop'
  ],
  'Ultra-light run shorts with HeatGear fabric for race-day performance.',
  'These are the shorts elite runners choose on race day. Ultralight HeatGear fabric wicks and dries fast, while the split hem and built-in brief provide freedom of movement.',
  '{"technology":"HeatGear","inseam":"5 inch","liner":"Built-in brief","reflective_details":true}',
  4.6, 133, null, false, true
),

-- ══════════════════════════════════════
-- NEW BALANCE  (6 products)
-- ══════════════════════════════════════

-- 27  NB Fresh Foam X 1080v13  ─  Running / Men / Shoes  (DROP)
(
  '00000000-0000-0000-0000-000000000027',
  'New Balance Fresh Foam X 1080v13',
  'New Balance','Running','Men','Shoes',
  649.00, null,
  ARRAY['Black/Phantom','White/Bright Lapis','Neon Dragonfly'],
  ARRAY['EU40','EU41','EU42','EU43','EU44','EU45','EU46'],
  ARRAY[
    'https://images.unsplash.com/photo-1556906781-9d8a3276e6f0?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop'
  ],
  'The pinnacle of New Balance cushioning, now in its 13th edition.',
  'The Fresh Foam X 1080v13 is the ultimate long-run shoe. The updated Fresh Foam X midsole is softer and more cushioned than ever, while the redesigned Hypoknit upper provides targeted support and breathability.',
  '{"midsole":"Fresh Foam X","weight":"298g","drop":"6mm","upper":"Hypoknit"}',
  4.8, 445, 'NEW', true, true
),

-- 28  NB Athletics Sweatshirt  ─  Casual / Men / Tops
(
  '00000000-0000-0000-0000-000000000028',
  'New Balance Athletics Remastered Sweatshirt',
  'New Balance','Casual','Men','Tops',
  319.00, null,
  ARRAY['Black','Sea Salt','Natural Indigo'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop'
  ],
  'Relaxed French terry sweatshirt with classic NB branding.',
  'Made from a heavyweight French terry blend, this Athletics sweatshirt delivers the comfort of a classic with the quality you expect from New Balance. A relaxed fit makes it ideal for off-court style.',
  '{"fabric":"80% Cotton / 20% Polyester","fit":"Relaxed","style":"Crew neck","weight":"Heavyweight"}',
  4.4, 167, null, false, true
),

-- 29  NB Women''s Impact Run Tight  ─  Running / Women / Bottoms
(
  '00000000-0000-0000-0000-000000000029',
  'New Balance Women''s Impact Run Crop Tight',
  'New Balance','Running','Women','Bottoms',
  279.00, null,
  ARRAY['Black','Eclipse','Vibrant Orange Glo'],
  ARRAY['XS','S','M','L','XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop'
  ],
  'Performance crop tights built for fast training runs.',
  'The Impact Run Crop Tights feature a high waist design and NB DRY moisture management fabric to keep you comfortable mile after mile. Reflective details ensure visibility in low light.',
  '{"fabric":"88% Polyester / 12% Elastane","technology":"NB Dry","rise":"High","length":"Crop","reflective":true}',
  4.7, 223, 'BESTSELLER', false, true
),

-- 30  NB 574 Kids  ─  Casual / Kids / Shoes
(
  '00000000-0000-0000-0000-000000000030',
  'New Balance 574 Classic Kids',
  'New Balance','Casual','Kids','Shoes',
  279.00, null,
  ARRAY['Grey/Navy','White/Pink','Black/Orange'],
  ARRAY['EU28','EU29','EU30','EU31','EU32','EU33','EU34','EU35'],
  ARRAY[
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop'
  ],
  'The iconic 574 silhouette scaled down for young trendsetters.',
  'Kids deserve iconic sneakers too. The 574 Classic Kids brings the legendary NB silhouette to smaller feet with the same ENCAP midsole for all-day comfort whether at school or play.',
  '{"midsole":"ENCAP","closure":"Hook-and-loop","upper":"Mesh + suede overlays"}',
  4.5, 189, null, false, true
),

-- 31  NB FuelCell SuperComp Elite v4  ─  Running / Unisex / Shoes  (DROP)
(
  '00000000-0000-0000-0000-000000000031',
  'New Balance FuelCell SuperComp Elite v4',
  'New Balance','Running','Unisex','Shoes',
  799.00, null,
  ARRAY['Neon Dragonfly/Black','White/Blue'],
  ARRAY['EU36','EU37','EU38','EU39','EU40','EU41','EU42','EU43','EU44','EU45'],
  ARRAY[
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop'
  ],
  'Carbon-plated race shoe engineered for marathon personal bests.',
  'The FuelCell SuperComp Elite v4 is NB''s fastest shoe ever. A full-length carbon fiber plate and updated FuelCell foam midsole deliver explosive energy return for race day.',
  '{"midsole":"FuelCell","plate":"Full-length carbon fiber","weight":"196g","drop":"4mm","usage":"Race day"}',
  4.9, 98, 'EXCLUSIVE', true, true
),

-- 32  NB Athletics French Terry Short  ─  Casual / Men / Bottoms
(
  '00000000-0000-0000-0000-000000000032',
  'New Balance Athletics French Terry Short',
  'New Balance','Casual','Men','Bottoms',
  199.00, null,
  ARRAY['Black','Asphalt','Wheat'],
  ARRAY['S','M','L','XL','2XL'],
  ARRAY[
    'https://images.unsplash.com/photo-1539600830741-7dbaea5ccf3d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop'
  ],
  'French terry shorts for effortless off-duty style.',
  'These relaxed shorts are made from a soft French terry blend that''s comfortable enough for the couch but stylish enough for the street. An elastic waistband with drawcord and side pockets complete the look.',
  '{"fabric":"80% Cotton / 20% Polyester","fit":"Relaxed","inseam":"7 inch","pockets":"2 side + 1 back"}',
  4.3, 142, null, false, true
)

on conflict (id) do nothing;


-- ────────────────────────────────────────────────────────────
-- PRODUCT VARIANTS  (auto-generate from products.colors × sizes)
-- Each color/size combo gets a random stock of 1–20 units.
-- ────────────────────────────────────────────────────────────
do $$
declare
  prod record;
  c    text;
  s    text;
begin
  for prod in select id, colors, sizes from products loop
    foreach c in array prod.colors loop
      foreach s in array prod.sizes loop
        insert into product_variants (product_id, color, size, stock_count)
        values (prod.id, c, s, floor(random() * 20 + 1)::int)
        on conflict (product_id, color, size) do nothing;
      end loop;
    end loop;
  end loop;
end;
$$;

-- Mark a few specific sizes as sold out to make size selectors realistic
update product_variants set stock_count = 0
where product_id = '00000000-0000-0000-0000-000000000001'
  and size = 'EU44'
  and color = 'Black';

update product_variants set stock_count = 2
where product_id = '00000000-0000-0000-0000-000000000008'
  and size = 'EU42';

update product_variants set stock_count = 0
where product_id = '00000000-0000-0000-0000-000000000031'
  and size in ('EU40','EU41')
  and color = 'White/Blue';


-- ────────────────────────────────────────────────────────────
-- DROPS  (5 limited flash drops)
-- ────────────────────────────────────────────────────────────
insert into drops (id, product_id, drop_time, units_total, units_sold, is_active)
values

-- Drop 1: Nike Therma-FIT jacket (already live)
(
  'dd000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000007',
  now() - interval '2 hours',
  150, 87, true
),

-- Drop 2: Puma Future 7 Pro (coming soon — 3 days from now)
(
  'dd000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000018',
  now() + interval '3 days',
  200, 0, false
),

-- Drop 3: UA Rush SmartForm Bra (coming soon — 1 day from now)
(
  'dd000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000023',
  now() + interval '1 day 6 hours',
  300, 0, false
),

-- Drop 4: NB Fresh Foam X 1080v13 (live — limited units)
(
  'dd000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000027',
  now() - interval '30 minutes',
  100, 62, true
),

-- Drop 5: NB FuelCell SuperComp Elite (coming soon — 7 days)
(
  'dd000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000031',
  now() + interval '7 days',
  50, 0, false
)

on conflict (id) do nothing;


-- ────────────────────────────────────────────────────────────
-- SAMPLE REVIEWS  (a few to seed ratings)
-- Note: uses a placeholder user_id. In production these come
-- from real authenticated users.
-- ────────────────────────────────────────────────────────────
-- (Reviews are skipped in seed — they require real auth.users rows.
--  Add them manually via the app or Supabase Table Editor.)


-- ────────────────────────────────────────────────────────────
-- COUPON CODES  (validated client-side in CheckoutContext)
-- ────────────────────────────────────────────────────────────
-- SPORT10   → 10% off
-- SAVE50    → 50 SAR flat
-- FREESHIP  → free shipping
-- NEWUSER20 → 20% off
-- VOLT30    → 30% off sale items
