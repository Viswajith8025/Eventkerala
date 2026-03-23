const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./src/models/Event');
const connectDB = require('./src/config/db');

dotenv.config();

const events = [
  {
    title: "HananSha Live in Concert",
    description: "An ethereal musical journey with HananSha, featuring a fusion of soulful melodies and modern electronic beats. A one-night-exclusive event in the heart of Kochi.",
    date: new Date('2026-05-15T19:00:00'),
    location: "Bolgatty Palace Grounds, Kochi",
    district: "Ernakulam",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000", // Placeholder for HananSha
    price: 1500,
    organizer: "HananSha Official",
    status: "approved"
  },
  {
    title: "Vedan Live: The Voice of Streets",
    description: "Experience the raw energy of Vedan as he takes the stage at Trivandrum. A powerful hip-hop performance that brings the stories of the streets to life.",
    date: new Date('2026-06-20T18:30:00'),
    location: "Nishagandhi Auditorium, Trivandrum",
    district: "Thiruvananthapuram",
    category: "Other",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000", // Placeholder for Vedan
    price: 800,
    organizer: "StreetVoice Entertainment",
    status: "approved"
  },
  {
    title: "Grand Kerala Car Expo 2026",
    description: "The biggest automotive show in South India. Discover supercars, electric vehicles, and classic vintage collections all under one roof.",
    date: new Date('2026-04-10T10:00:00'),
    location: "Calicut Trade Centre, Kozhikode",
    district: "Kozhikode",
    category: "Other",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000", // Placeholder for Car Expo
    price: 200,
    organizer: "AutoExpo Kerala",
    status: "approved"
  },
  {
    title: "Malabar International Food Festival",
    description: "A culinary feast featuring authentic flavors from across Malabar and international guest chefs. Cooking workshops, live music, and endless tasting stalls.",
    date: new Date('2026-07-05T12:00:00'),
    location: "Pookode Lake Grounds, Wayanad",
    district: "Wayanad",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000",
    price: 0,
    organizer: "Wayanad Tourism Council",
    status: "approved"
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Event.deleteMany(); // Clear existing events
    await Event.insertMany(events);
    console.log('Database Seeded Successfully! 🌴🌟');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
