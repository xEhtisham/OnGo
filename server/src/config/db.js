import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ongo';
  const localUri = 'mongodb://127.0.0.1:27017/ongo';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    const safeHost = conn.connection.host;
    const safeDbName = conn.connection.name;
    console.log(`[Database] MongoDB Connected: ${safeHost}/${safeDbName}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Primary connection failed: ${error.message}`);
    if (uri !== localUri) {
      console.log(`[Database] Attempting fallback to local MongoDB instance (${localUri})...`);
      try {
        const localConn = await mongoose.connect(localUri, {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(`[Database] Connected successfully to local MongoDB: ${localConn.connection.host}/${localConn.connection.name}`);
        return localConn;
      } catch (localError) {
        console.error(`[Database Error] Local fallback failed: ${localError.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

export default connectDB;
