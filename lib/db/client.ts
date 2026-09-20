import { MongoClient } from 'mongodb'
import { getEnvironment } from '@/config/environment'

type MongoState = {
  connection?: Promise<MongoClient>
  indexesReady?: Promise<void>
}

const globalForMongo = globalThis as typeof globalThis & { __paytrackMongo?: MongoState }

export async function getDatabase() {
  const { MONGO_URL, DB_NAME } = getEnvironment()
  const state = (globalForMongo.__paytrackMongo ??= {})
  state.connection ??= new MongoClient(MONGO_URL).connect()
  const client = await state.connection
  const db = client.db(DB_NAME)

  state.indexesReady ??= db
    .collection('payroll_records')
    .createIndex({ employeeId: 1, period: 1 }, { unique: true, name: 'payroll_employee_period_unique' })
    .then(() => undefined)

  await state.indexesReady
  return db
}
