declare module '*.css'

declare global {
  var __paytrackMongo: Promise<import('mongodb').MongoClient> | undefined
}

export {}
