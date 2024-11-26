import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('MongoDB: Attempting new connection...');
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => {
        console.log('MongoDB: Connection successful.');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB: Connection failed.', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;