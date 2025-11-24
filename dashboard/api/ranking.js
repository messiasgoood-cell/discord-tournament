import { MongoClient } from 'mongodb';

const mongo = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await mongo.connect();
    const db = mongo.db('discord-tournament');
    const ranking = await db.collection('ranking').find({}).sort({ rating: -1 }).limit(100).toArray();
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await mongo.close();
  }
}
