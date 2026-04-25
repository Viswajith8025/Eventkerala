const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./src/models/Event');
const connectDB = require('./src/config/db');

dotenv.config();

const events = [
  {
    title: "Thrissur Pooram 2026",
    description: "The 'Festival of Festivals' in Kerala. A grand display of decorated elephants, traditional percussion (Melam), and spectacular fireworks at the Vadakkunnathan Temple.",
    date: new Date('2026-04-26T14:00:00'),
    location: "Thekkinkadu Maidan, Thrissur",
    district: "Thrissur",
    category: "Temple Festivals",
    image: "https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&q=80&w=1000",
    price: 0,
    status: "approved",
    isSponsored: true
  },
  {
    title: "Nehru Trophy Boat Race",
    description: "The most famous snake boat race in the world. Witness the rhythmic rowing of hundred-rower boats on the Punnamada Lake.",
    date: new Date('2026-08-08T11:00:00'),
    location: "Punnamada Lake, Alappuzha",
    district: "Alappuzha",
    category: "Other",
    image: "https://images.unsplash.com/photo-1603204077823-3a789a74a621?auto=format&fit=crop&q=80&w=1000",
    price: 500,
    status: "approved"
  },
  {
    title: "Theyyam Ritual Performance",
    description: "Experience the divine dance of Northern Kerala. Theyyam is a ritualistic art form where men transform into deities through elaborate costumes and intense performances.",
    date: new Date('2026-11-20T22:00:00'),
    location: "Parassinikadavu, Kannur",
    district: "Kannur",
    category: "Sacred Rituals",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=1000",
    price: 0,
    status: "approved"
  },
  {
    title: "Kochi-Muziris Biennale",
    description: "The largest contemporary art exhibition in South Asia. International artists showcase their work across various venues in Fort Kochi and Mattancherry.",
    date: new Date('2026-12-12T10:00:00'),
    location: "Aspinwall House, Fort Kochi",
    district: "Ernakulam",
    category: "Art Forms",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1000",
    price: 150,
    status: "approved"
  },
  {
    title: "Onam Week Celebrations",
    description: "The harvest festival of Kerala. Grand processions, Pulikali (Tiger Dance), and elaborate Pookalams (Floral Carpets) across the state capital.",
    date: new Date('2026-09-04T09:00:00'),
    location: "Kanakakunnu Palace, Thiruvananthapuram",
    district: "Thiruvananthapuram",
    category: "Other",
    image: "https://images.unsplash.com/photo-1599427303058-f16cb9fc8568?auto=format&fit=crop&q=80&w=1000",
    price: 0,
    status: "approved"
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Event.deleteMany(); 
    await Event.insertMany(events);
    console.log('Database Seeded with Authentic Heritage Data! 🌴🌟');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
