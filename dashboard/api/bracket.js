import { MongoClient } from 'mongodb';

const mongo = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await mongo.connect();
    const db = mongo.db('discord-tournament');
    const id = req.query.id;
    const torneo = await db.collection('tournaments').findOne({ id });
    const participants = await db.collection('teams').find({ tournamentId: id }).toArray();
    const matches = await db.collection('matches').find({ tournamentId: id }).toArray();
    res.json({ torneo, participants, matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await mongo.close();
  }
}
