import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (cached.conn) {
    console.log('MongoDB is already connected');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI)
      .then((mongoose) => {
        console.log('MongoDB connected...');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('MongoDB connection failed');
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;