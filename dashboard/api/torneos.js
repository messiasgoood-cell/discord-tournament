import { MongoClient } from 'mongodb';

const mongo = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await mongo.connect();
    const db = mongo.db('discord-tournament');
    const guildId = req.query.guildId;
    if (!guildId) return res.status(400).json({ error: 'guildId required' });
    const torneos = await db.collection('tournaments').find({ guildId }).toArray();
    res.json(torneos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await mongo.close();
  }
}
