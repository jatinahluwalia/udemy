import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(String(process.env.DATABASE_URL));
      console.log('Connected to DB');
      isConnected = true;
    } catch (error) {
      console.log('Error connecting to DB');
    }
  } else {
    console.log('Already Connected');
  }
};
