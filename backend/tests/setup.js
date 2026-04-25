const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Set env variables for testing
process.env.JWT_SECRET = 'test_secret_key_12345';
process.env.JWT_EXPIRE = '30d';
process.env.NODE_ENV = 'test';

let mongoServer;

const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop({ force: true });
};

const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

module.exports = { connect, close, clear };
