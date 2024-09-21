import * as mongodb from "mongodb"
import logger from "../utils/winston"
const MongoClient = mongodb.MongoClient
const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.htxdhug.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: mongodb.ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

// mongo db instance
let db: mongodb.MongoClient

// initial config
export const initializeMongoDb = async () => {
  try {
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 })
    logger.info(
      "Pinged your deployment. You successfully connected to MongoDB!"
    )
    db = client
    return db
  } catch (err) {
    logger.error("error initializing db", err)
  }
}

// get mongo instance
export const mongoDB = () => db
