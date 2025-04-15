// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://mahanibaharisa:Passwordbodoh123@baharisamongodbcluster.rqbdooy.mongodb.net/movieapp?retryWrites=true&w=majority&appName=BaharisaMongoDBCluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to BaharisaMongoDBCluster!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
