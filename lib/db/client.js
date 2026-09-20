import { MongoClient } from 'mongodb'
import { getEnvironment } from '@/config/environment'

const globalForMongo = globalThis

export async function getDatabase() {
  const { MONGO_URL, DB_NAME } = getEnvironment()
  if (!globalForMongo.__paytrackMongo) {
    globalForMongo.__paytrackMongo = new MongoClient(MONGO_URL).connect()
  }
  const client = await globalForMongo.__paytrackMongo
  return client.db(DB_NAME)
}
