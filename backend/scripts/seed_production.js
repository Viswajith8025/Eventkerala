const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../src/models/Event');
const Place = require('../src/models/Place');
const connectDB = require('../src/config/db');

dotenv.config();

const events = [
  {
    "title": "Thrissur Pooram",
    "description": "A thunderous celebration where caparisoned elephants, percussion, and fireworks turn the city into a royal theatre of devotion. Every rhythm carries centuries of pride and artistry.",
    "district": "Thrissur",
    "date": "2027-05-10",
    "location": "Vadakkunnathan Temple Grounds",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1513151233558-d860c5398176"
  },
  {
    "title": "Attukal Pongala",
    "description": "Millions of lamps and hearths bloom across the capital as women gather in sacred unity. Faith rises with the fragrant steam of sweet offerings.",
    "district": "Thiruvananthapuram",
    "date": "2027-03-13",
    "location": "Attukal Bhagavathy Temple",
    "category": "Sacred Rituals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  },
  {
    "title": "Parassinikkadavu Muthappan Theyyam",
    "description": "At dawn, drums awaken the riverbank shrine where devotion meets living folklore. The presence of Muthappan is felt in every flame and chant.",
    "district": "Kannur",
    "date": "2026-12-18",
    "location": "Parassinikkadavu Temple",
    "category": "Sacred Rituals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d"
  },
  {
    "title": "Nishagandhi Dance Festival",
    "description": "Under open skies, classical movement and music unfold like poetry. Kerala’s nights glow with elegance and disciplined grace.",
    "district": "Thiruvananthapuram",
    "date": "2027-01-22",
    "location": "Nishagandhi Auditorium",
    "category": "Art Forms",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1503095396549-807759245b35"
  },
  {
    "title": "Kottiyoor Vaisakha Mahotsavam",
    "description": "Deep within forested silence, rituals of rare antiquity are observed with humility and wonder. Nature itself becomes part of the shrine.",
    "district": "Kannur",
    "date": "2027-06-08",
    "location": "Kottiyoor Temple",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d"
  },
  {
    "title": "Aranmula Uthrattathi Vallamkali",
    "description": "Snake boats glide like legends across sacred waters as songs echo through the banks. Competition gives way to tradition and pageantry.",
    "district": "Pathanamthitta",
    "date": "2027-09-05",
    "location": "Aranmula Parthasarathy Temple Riverfront",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "title": "Onam Cultural Week",
    "description": "Floral carpets, music, and festive warmth transform the city into a grand welcome. Heritage and hospitality meet in joyful abundance.",
    "district": "Ernakulam",
    "date": "2026-09-12",
    "location": "Marine Drive Grounds",
    "category": "Art Forms",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    "title": "Bekal Beach Festival",
    "description": "Sea breeze, lights, and cultural performances gather beneath the fort’s timeless silhouette. A coastal celebration where history meets leisure.",
    "district": "Kasaragod",
    "date": "2027-02-09",
    "location": "Bekal Fort Beach Grounds",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "title": "Guruvayur Ekadasi",
    "description": "Temple bells and devotion fill the air as pilgrims arrive in reverence. The sacred day shines with disciplined prayer and serene faith.",
    "district": "Thrissur",
    "date": "2026-12-11",
    "location": "Guruvayur Temple",
    "category": "Sacred Rituals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "title": "Malabar Mahotsavam",
    "description": "A vibrant showcase of northern Kerala’s music, craft, and culinary pride. Tradition takes the stage with confident modern energy.",
    "district": "Kozhikode",
    "date": "2027-01-10",
    "location": "Mananchira Grounds",
    "category": "Art Forms",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
  },
  {
    "title": "Kalpathy Ratholsavam",
    "description": "Ancient streets awaken as temple chariots roll through rows of heritage homes. Music, devotion, and memory move together in timeless harmony.",
    "district": "Palakkad",
    "date": "2027-11-14",
    "location": "Kalpathy Temple Street",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
  },
  {
    "title": "Sabarimala Mandala Season",
    "description": "Millions journey through forested paths in discipline and prayer. The pilgrimage carries silence, endurance, and profound spiritual unity.",
    "district": "Pathanamthitta",
    "date": "2026-12-20",
    "location": "Sabarimala Temple",
    "category": "Sacred Rituals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b"
  },
  {
    "title": "Chettikulangara Kumbha Bharani",
    "description": "Towering effigies and ceremonial processions transform the night into a spectacle of devotion. Tradition arrives with grandeur and thunder.",
    "district": "Alappuzha",
    "date": "2027-03-04",
    "location": "Chettikulangara Temple",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
  },
  {
    "title": "Mamangam Heritage Festival",
    "description": "Stories of valor and forgotten courts return through curated performances and living history. The past steps forward with regal dignity.",
    "district": "Malappuram",
    "date": "2027-01-26",
    "location": "Tirunavaya Heritage Grounds",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    "title": "Poorakkali Festival",
    "description": "Circles of rhythm and movement honor the old traditions of North Malabar. Every step is both celebration and remembrance.",
    "district": "Kasaragod",
    "date": "2027-04-19",
    "location": "Nileshwar Temple Grounds",
    "category": "Art Forms",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1516280440614-37939bbacd81"
  },
  {
    "title": "Thirunakkara Festival",
    "description": "Temple lamps, drums, and elephants create a stately procession through the city. Kottayam gathers in elegant devotion.",
    "district": "Kottayam",
    "date": "2027-03-30",
    "location": "Thirunakkara Mahadeva Temple",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1491553895911-0055eca6402d"
  },
  {
    "title": "Nehru Trophy Boat Festival",
    "description": "Waters surge with speed, cheers, and disciplined rowing power. Kerala’s backwaters become a grand arena of unity and pride.",
    "district": "Alappuzha",
    "date": "2027-08-09",
    "location": "Punnamada Lake",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "title": "Wayanad Monsoon Heritage Walk",
    "description": "Misty trails lead through stories of tribes, forests, and hidden shrines. Rain paints the landscape with quiet magnificence.",
    "district": "Wayanad",
    "date": "2027-07-12",
    "location": "Ambalavayal Heritage Zone",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "title": "Munnar Blossom Festival",
    "description": "Hills dressed in cool winds and distant music welcome visitors into a graceful mountain celebration. Nature becomes the headline attraction.",
    "district": "Idukki",
    "date": "2027-02-22",
    "location": "Munnar Town Grounds",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "title": "Ashtami Rohini Celebration",
    "description": "Children in divine attire and lamps of devotion fill the temple streets. Joy and reverence meet in radiant innocence.",
    "district": "Thrissur",
    "date": "2027-08-16",
    "location": "Guruvayur Temple",
    "category": "Sacred Rituals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "title": "Kadammanitta Padayani",
    "description": "Masks, fire, and ritual rhythm transform the village night into sacred theatre. Ancient devotion survives through fierce artistic beauty.",
    "district": "Pathanamthitta",
    "date": "2027-04-07",
    "location": "Kadammanitta Devi Temple",
    "category": "Sacred Rituals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
  },
  {
    "title": "Payippad Jalotsavam",
    "description": "Long boats cut through shining waters while the crowd roars with excitement. Tradition and athletic grace move in perfect rhythm.",
    "district": "Alappuzha",
    "date": "2027-09-18",
    "location": "Payippad River",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "title": "Theyyam Season at Kannur",
    "description": "Sacred performers emerge in dazzling costume and firelit intensity. Myth, ancestry, and devotion come alive before your eyes.",
    "district": "Kannur",
    "date": "2027-01-15",
    "location": "Various Kavus, Kannur",
    "category": "Art Forms",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d"
  },
  {
    "title": "Beypore Uru Heritage Fair",
    "description": "The old shipbuilding coast celebrates craftsmanship shaped by sea winds and centuries of trade. Timber, skill, and pride define the harbor.",
    "district": "Kozhikode",
    "date": "2027-02-14",
    "location": "Beypore Port Grounds",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda"
  },
  {
    "title": "Kodungallur Bharani",
    "description": "A powerful and ancient expression of devotion where chants and ritual intensity fill the shrine precincts. Tradition stands unapologetically alive.",
    "district": "Thrissur",
    "date": "2027-03-31",
    "location": "Kodungallur Bhagavathy Temple",
    "category": "Sacred Rituals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "title": "Malanada Kettukazhcha",
    "description": "Gigantic ceremonial structures rise like moving monuments in a grand village procession. Community craftsmanship becomes a sacred spectacle.",
    "district": "Kollam",
    "date": "2027-04-11",
    "location": "Poruvazhy Malanada Temple",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
  },
  {
    "title": "Ponnani Nercha Festival",
    "description": "Faith, gathering, and shared generosity define this coastal celebration. Heritage breathes through prayer and communal warmth.",
    "district": "Malappuram",
    "date": "2027-05-18",
    "location": "Ponnani Town Grounds",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
  },
  {
    "title": "Peruvanam Pooram",
    "description": "Temple percussion rises like thunder beneath ancient trees and glowing lamps. Grandeur arrives in disciplined rhythm and pageantry.",
    "district": "Thrissur",
    "date": "2027-04-06",
    "location": "Peruvanam Temple",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1513151233558-d860c5398176"
  },
  {
    "title": "Vaikom Ashtami",
    "description": "A revered celebration where processions, lamps, and devotion surround one of Kerala’s iconic shrines. Serenity and splendor meet gracefully.",
    "district": "Kottayam",
    "date": "2026-12-03",
    "location": "Vaikom Mahadeva Temple",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "title": "Silent Valley Nature Heritage Week",
    "description": "Forests of rare beauty host guided experiences that celebrate ecological wisdom and quiet wonder. Nature becomes the teacher.",
    "district": "Palakkad",
    "date": "2027-06-21",
    "location": "Silent Valley Visitor Centre",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "title": "Kochi Biennale Season",
    "description": "Historic warehouses and coastal lanes transform into galleries of global imagination. Contemporary art meets Kerala’s maritime soul.",
    "district": "Ernakulam",
    "date": "2027-12-12",
    "location": "Fort Kochi Biennale Venues",
    "category": "Art Forms",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1503095396549-807759245b35"
  },
  {
    "title": "Varkala Cliff Spiritual Retreat",
    "description": "Where cliffs meet the Arabian Sea, meditation and sacred calm unfold with every sunrise. Wellness becomes a coastal ritual.",
    "district": "Thiruvananthapuram",
    "date": "2027-02-03",
    "location": "Varkala Cliff Grounds",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "title": "Kasaragod Theyyam Trails",
    "description": "Remote shrines glow with fire, drums, and ancestral stories. Each performance reveals devotion in vivid ceremonial splendor.",
    "district": "Kasaragod",
    "date": "2027-01-29",
    "location": "Various Kavus, Kasargod",
    "category": "Art Forms",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d"
  },
  {
    "title": "Muziris Heritage Carnival",
    "description": "Ancient trade routes and multicultural memories return through curated experiences, music, and heritage walks. History speaks through the streets.",
    "district": "Ernakulam",
    "date": "2027-08-24",
    "location": "Muziris Heritage Zone",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda"
  },
  {
    "title": "Athachamayam Parade",
    "description": "Colorful processions, folk art, and festive pride announce the arrival of Onam with regal excitement. Celebration marches with joy.",
    "district": "Ernakulam",
    "date": "2027-08-27",
    "location": "Tripunithura Town",
    "category": "Art Forms",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
  },
  {
    "title": "Punalur River Heritage Fest",
    "description": "Bridges, river breeze, and local performances shape a charming celebration of Kollam’s inland heritage. Community warmth defines the evening.",
    "district": "Kollam",
    "date": "2027-11-09",
    "location": "Punalur Riverfront",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    "title": "Nilambur Teak Heritage Fair",
    "description": "Forest legacy and craftsmanship are honored amid grand trees and heritage estates. Nature and history stand side by side.",
    "district": "Malappuram",
    "date": "2027-07-06",
    "location": "Nilambur Teak Museum Grounds",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "title": "Idukki Hill Harvest Festival",
    "description": "Mountain farms and cool valleys celebrate abundance with music, local flavors, and warm hospitality. The hills welcome every traveler.",
    "district": "Idukki",
    "date": "2027-10-19",
    "location": "Kattappana Grounds",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "title": "Kozhikode Food Heritage Week",
    "description": "The city’s legendary culinary traditions are plated with pride and aroma. Every bite tells a story of coast, spice, and trade.",
    "district": "Kozhikode",
    "date": "2027-06-14",
    "location": "SM Street Festival Zone",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
  },
  {
    "title": "Alleppey Backwater Lantern Night",
    "description": "Reflections of floating lights dance across still canals as music drifts through the evening air. Romance and heritage meet on water.",
    "district": "Alappuzha",
    "date": "2027-12-21",
    "location": "Alappuzha Backwaters",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "title": "Pathiramanal Island Heritage Cruise",
    "description": "A gentle cruise through whispering waters leads to an island wrapped in birdsong and stillness. Backwater beauty arrives in quiet elegance.",
    "district": "Alappuzha",
    "date": "2027-01-11",
    "location": "Pathiramanal Jetty",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "title": "Mannarasala Ayilyam Festival",
    "description": "Thousands gather at the sacred serpent grove where lamps, prayers, and blessings create an atmosphere of rare mysticism. Faith rests beneath ancient trees.",
    "district": "Alappuzha",
    "date": "2027-10-08",
    "location": "Mannarasala Sree Nagaraja Temple",
    "category": "Sacred Rituals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "title": "Wayanad Tribal Heritage Festival",
    "description": "Songs, craft traditions, and ancestral wisdom are shared amid misty hills and forest air. Heritage is preserved through living voices.",
    "district": "Wayanad",
    "date": "2027-08-02",
    "location": "Ambalavayal Heritage Village",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "title": "Kottarakkara Ganapathy Utsavam",
    "description": "Temple lamps and devotional music surround one of Kerala’s beloved shrines. The celebration glows with reverence and festive warmth.",
    "district": "Kollam",
    "date": "2027-05-02",
    "location": "Kottarakkara Ganapathy Temple",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1513151233558-d860c5398176"
  },
  {
    "title": "Chottanikkara Makam Thozhal",
    "description": "An immense gathering of devotion fills the temple precincts with prayer and expectation. Sacred energy rises before dawn.",
    "district": "Ernakulam",
    "date": "2027-02-26",
    "location": "Chottanikkara Temple",
    "category": "Sacred Rituals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "title": "Kasaragod Coastal Heritage Fair",
    "description": "Sea traditions, folk performance, and coastal flavors come together beside windswept shores. The northern coast celebrates its identity with pride.",
    "district": "Kasaragod",
    "date": "2027-11-23",
    "location": "Kasaragod Beach Grounds",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "title": "Palakkad Fort Cultural Nights",
    "description": "Historic walls frame evenings of music, light, and artistic expression. The fort once again becomes a gathering place of grandeur.",
    "district": "Palakkad",
    "date": "2027-09-13",
    "location": "Palakkad Fort",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda"
  },
  {
    "title": "Kumarakom Birding Festival",
    "description": "Dawn mist lifts over the lake as wings fill the sky in graceful migration. Nature lovers gather in serene wonder.",
    "district": "Kottayam",
    "date": "2027-01-25",
    "location": "Kumarakom Bird Sanctuary",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    "title": "Irinjalakuda Koodalmanikyam Festival",
    "description": "Ancient temple traditions unfold with measured elegance, music, and lamps. Every ritual carries a noble stillness.",
    "district": "Thrissur",
    "date": "2027-04-27",
    "location": "Koodalmanikyam Temple",
    "category": "Temple Festivals",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1513151233558-d860c5398176"
  },
  {
    "title": "Vagamon Meadow Music Retreat",
    "description": "Rolling grasslands host melodies, cool winds, and peaceful gatherings above the clouds. Leisure feels elevated and timeless.",
    "district": "Idukki",
    "date": "2027-06-29",
    "location": "Vagamon Meadows",
    "category": "Heritage Sites",
    "status": "approved",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  }
];

const places = [
  {
    "name": "Bekal Fort",
    "district": "Kasaragod",
    "category": "Heritage",
    "description": "Rising above the Arabian Sea, Bekal Fort is a majestic reminder of Kerala’s coastal legacy. Sunset here feels cinematic, timeless, and grand.",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "name": "Athirappilly Falls",
    "district": "Thrissur",
    "category": "Waterfall",
    "description": "A roaring curtain of water hidden within lush forests, Athirappilly is one of Kerala’s most dramatic natural wonders. Mist and thunder create unforgettable awe.",
    "image": "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2"
  },
  {
    "name": "Padmanabhaswamy Temple",
    "district": "Thiruvananthapuram",
    "category": "Temple",
    "description": "An architectural marvel wrapped in devotion and royal history. Every carved stone whispers of faith, power, and sacred elegance.",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "name": "Munnar",
    "district": "Idukki",
    "category": "Hill Station",
    "description": "Rolling tea gardens, cool winds, and endless green valleys make Munnar a mountain dream. Serenity lives in every curve of the hills.",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "name": "Alappuzha Backwaters",
    "district": "Alappuzha",
    "category": "Backwater",
    "description": "Still waters, swaying palms, and houseboats drifting through village life define this iconic Kerala escape. Time slows beautifully here.",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Fort Kochi",
    "district": "Ernakulam",
    "category": "Heritage",
    "description": "Colonial streets, sea breeze, and Chinese fishing nets create a rare blend of cultures. Fort Kochi is history you can walk through.",
    "image": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda"
  },
  {
    "name": "Kovalam Beach",
    "district": "Thiruvananthapuram",
    "category": "Beach",
    "description": "Golden sands and gentle waves meet vibrant coastal life at Kerala’s famous seaside retreat. Sunrise here feels endlessly refreshing.",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "name": "Wayanad Wildlife Sanctuary",
    "district": "Wayanad",
    "category": "Nature",
    "description": "Dense forests and hidden trails shelter wildlife and tribal heritage in equal measure. Adventure begins with every step inside.",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "name": "Guruvayur Temple",
    "district": "Thrissur",
    "category": "Spiritual",
    "description": "One of Kerala’s most revered shrines, where devotion flows in disciplined grace. The atmosphere is both powerful and peaceful.",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "name": "Silent Valley National Park",
    "district": "Palakkad",
    "category": "Nature",
    "description": "An untouched rainforest of rare beauty and ecological importance. Silence here is alive with birdsong and hidden life.",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "name": "Varkala Cliff",
    "district": "Thiruvananthapuram",
    "category": "Beach",
    "description": "Dramatic cliffs overlooking the sea create one of Kerala’s most iconic coastal scenes. Sunsets here feel effortlessly luxurious.",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "name": "Kumarakom",
    "district": "Kottayam",
    "category": "Backwater",
    "description": "A graceful world of canals, birds, and lakeside calm. Kumarakom offers Kerala’s waters at their most refined.",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Edakkal Caves",
    "district": "Wayanad",
    "category": "Heritage",
    "description": "Ancient carvings etched into stone make these caves a portal to distant human history. Mystery lives in every wall.",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "name": "Thekkady",
    "district": "Idukki",
    "category": "Nature",
    "description": "Lakes, forests, and wildlife combine to create one of South India’s finest eco escapes. Every journey here feels immersive.",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "name": "Marari Beach",
    "district": "Alappuzha",
    "category": "Beach",
    "description": "Peaceful shores and village simplicity make Marari an elegant alternative to crowded beaches. Calm arrives naturally here.",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "name": "Thrissur Vadakkunnathan Temple",
    "district": "Thrissur",
    "category": "Temple",
    "description": "An ancient temple surrounded by majestic grounds at the heart of Kerala’s cultural capital. Heritage and devotion stand beautifully preserved.",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "name": "Beypore",
    "district": "Kozhikode",
    "category": "Heritage",
    "description": "A historic port famed for traditional shipbuilding and maritime memory. Sea winds still carry stories of old trade routes.",
    "image": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda"
  },
  {
    "name": "Ponmudi",
    "district": "Thiruvananthapuram",
    "category": "Hill Station",
    "description": "Mist, winding roads, and cool mountain air make Ponmudi a refreshing highland retreat close to the capital.",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "name": "Parambikulam Tiger Reserve",
    "district": "Palakkad",
    "category": "Nature",
    "description": "Dense wilderness rich in biodiversity and quiet wonder. Nature reveals itself slowly and magnificently here.",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "name": "Thusharagiri Falls",
    "district": "Kozhikode",
    "category": "Waterfall",
    "description": "Hidden among forested slopes, these cascades reward every traveler with cool spray and scenic beauty. Adventure begins on the trail.",
    "image": "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2"
  },
  {
    "name": "Muzhappilangad Drive-in Beach",
    "district": "Kannur",
    "category": "Beach",
    "description": "India’s celebrated drive-in beach offers long shores, sea breeze, and rare coastal freedom. The horizon feels open and exhilarating.",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "name": "Parassinikkadavu Temple",
    "district": "Kannur",
    "category": "Spiritual",
    "description": "A riverside shrine where devotion blends with folklore and living tradition. The atmosphere is intimate, warm, and deeply rooted.",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "name": "Nelliampathy",
    "district": "Palakkad",
    "category": "Hill Station",
    "description": "Tea estates, cool forests, and winding roads create a lesser-known mountain escape of graceful charm and silence.",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "name": "Thenmala Eco Park",
    "district": "Kollam",
    "category": "Nature",
    "description": "One of India’s pioneering eco-tourism destinations where forest experiences meet thoughtful conservation. Leisure feels meaningful here.",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "name": "Pookode Lake",
    "district": "Wayanad",
    "category": "Nature",
    "description": "A calm freshwater lake embraced by evergreen hills and misty air. Every ripple invites unhurried peace.",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    "name": "Kappad Beach",
    "district": "Kozhikode",
    "category": "Beach",
    "description": "Historic shores where Vasco da Gama once arrived now offer waves, wind, and a chapter of global history.",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "name": "Pathanamthitta Sabarimala",
    "district": "Pathanamthitta",
    "category": "Spiritual",
    "description": "One of the world’s great pilgrim destinations, reached through devotion, endurance, and forested ascent. Faith defines the journey.",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "name": "Malampuzha Dam Gardens",
    "district": "Palakkad",
    "category": "Nature",
    "description": "Gardens, water views, and family leisure combine at one of Kerala’s beloved public landscapes. Evenings here feel festive and open.",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    "name": "Ashtamudi Lake",
    "district": "Kollam",
    "category": "Backwater",
    "description": "A sprawling lake of graceful waterways and traditional livelihoods. Backwater life unfolds here with authentic charm.",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Illikkal Kallu",
    "district": "Kottayam",
    "category": "Hill Station",
    "description": "Rocky peaks, drifting clouds, and dramatic viewpoints make this highland escape unforgettable. The sky feels close enough to touch.",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "name": "Poovar Island",
    "district": "Thiruvananthapuram",
    "category": "Backwater",
    "description": "Where river, sea, and golden sands meet in elegant harmony, Poovar feels like a hidden luxury retreat shaped by nature.",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Mannarasala Temple",
    "district": "Alappuzha",
    "category": "Temple",
    "description": "A sacred serpent grove wrapped in silence, lamps, and centuries of devotion. Spiritual mystery lingers beneath every tree.",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "name": "Ranipuram",
    "district": "Kasaragod",
    "category": "Hill Station",
    "description": "Rolling grasslands and cool mountain paths make Ranipuram a northern escape of open skies and quiet adventure.",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "name": "Periyar Lake",
    "district": "Idukki",
    "category": "Nature",
    "description": "Calm waters bordered by wild forests create one of Kerala’s most serene landscapes. Nature feels majestic and undisturbed here.",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    "name": "Cherai Beach",
    "district": "Ernakulam",
    "category": "Beach",
    "description": "A lively coastal stretch where soft sands meet backwater charm and city convenience. Relaxation comes effortlessly here.",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "name": "Meesapulimala",
    "district": "Idukki",
    "category": "Hill Station",
    "description": "Cloud trails, mountain ridges, and sunrise panoramas make this trekker’s paradise unforgettable. Every climb rewards the soul.",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "name": "Vadakara Sand Banks",
    "district": "Kozhikode",
    "category": "Beach",
    "description": "Quiet shores and open skies create a peaceful northern coastline away from the crowds. Simplicity becomes the luxury.",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "name": "Jatayu Earth Center",
    "district": "Kollam",
    "category": "Heritage",
    "description": "Mythology, sculpture, and dramatic landscapes meet at this iconic destination. Legend rises in monumental form.",
    "image": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda"
  },
  {
    "name": "Aranmula Temple",
    "district": "Pathanamthitta",
    "category": "Temple",
    "description": "A revered riverside shrine known for devotion, tradition, and the famed boat race heritage of Kerala. Sacred grace flows here.",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "name": "Kuruva Island",
    "district": "Wayanad",
    "category": "Nature",
    "description": "River channels and dense greenery shape an island escape of rare calm and biodiversity. It feels wonderfully untouched.",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  {
    "name": "Chembra Peak",
    "district": "Wayanad",
    "category": "Hill Station",
    "description": "Famous for sweeping mountain views and the heart-shaped lake along its trail, Chembra is adventure wrapped in beauty.",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "name": "Valiyaparamba Backwaters",
    "district": "Kasaragod",
    "category": "Backwater",
    "description": "Quiet waterways and coastal serenity create one of North Kerala’s hidden aquatic treasures. Peace arrives with every tide.",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Thirunelli Temple",
    "district": "Wayanad",
    "category": "Spiritual",
    "description": "Nestled in forested hills, this ancient temple carries deep serenity and timeless sacred presence. Nature protects its silence.",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  {
    "name": "Nilambur Teak Museum",
    "district": "Malappuram",
    "category": "Heritage",
    "description": "A tribute to forestry legacy and craftsmanship, where wood, history, and learning meet in elegant simplicity.",
    "image": "https://images.unsplash.com/photo-1473116763249-2faaef81ccda"
  },
  {
    "name": "Munroe Island",
    "district": "Kollam",
    "category": "Backwater",
    "description": "Narrow canals, village life, and glowing sunsets make this island a soulful backwater experience of rare authenticity.",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    "name": "Peechi Dam",
    "district": "Thrissur",
    "category": "Nature",
    "description": "Water views, green surroundings, and calm open spaces make Peechi a refreshing escape near the city.",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    "name": "Kottakkunnu",
    "district": "Malappuram",
    "category": "Nature",
    "description": "Hilltop gardens, open skies, and lively evenings create a beloved urban retreat with scenic charm and family warmth.",
    "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    "name": "Anchuruli Tunnel",
    "district": "Idukki",
    "category": "Nature",
    "description": "A dramatic tunnel opening into misty landscapes and water views, offering one of Kerala’s most cinematic experiences.",
    "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    "name": "Payyambalam Beach",
    "district": "Kannur",
    "category": "Beach",
    "description": "A wide and elegant shoreline known for golden evenings and graceful promenades. Coastal leisure feels refined here.",
    "image": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21"
  },
  {
    "name": "Haripad Subrahmanya Temple",
    "district": "Alappuzha",
    "category": "Temple",
    "description": "An ancient shrine of devotion and cultural significance where tradition continues with quiet dignity and faith.",
    "image": "https://images.unsplash.com/photo-1494526585095-c41746248156"
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');
    await Event.deleteMany();
    await Place.deleteMany();

    console.log(`Injecting ${events.length} Heritage Events...`);
    await Event.insertMany(events);

    console.log(`Injecting ${places.length} Heritage Places...`);
    await Place.insertMany(places);

    console.log('Database seeded successfully with 100+ Authentic Kerala Experiences! 🌴✨');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
