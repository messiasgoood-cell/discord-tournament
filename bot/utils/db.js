import { MongoClient } from 'mongodb';
import { CONFIG } from '../config.js';

let client;
let db;

export async function connectDB() {
  try {
    if (!CONFIG.MONGODB_URI) {
      console.error('❌ MONGODB_URI no definida');
      return null;
    }
    
    console.log('🔗 Conectando a MongoDB...');
    
    client = new MongoClient(CONFIG.MONGODB_URI, { 
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 20000,
      socketTimeoutMS: 20000,
      retryWrites: true,
      w: 'majority'
    });
    await client.connect();
    db = client.db('discord-tournament');
    
    // Crear índices
    try {
      await db.collection('tournaments').createIndex({ guildId: 1 });
      await db.collection('players').createIndex({ userId: 1 });
      await db.collection('teams').createIndex({ tournamentId: 1, userId: 1 });
      await db.collection('matches').createIndex({ tournamentId: 1 });
      await db.collection('ranking').createIndex({ userId: 1 });
    } catch (indexError) {
      console.log('⚠️ Índices ya existen:', indexError.message.substring(0, 50));
    }
    
    console.log('✅ MongoDB conectado correctamente');
    return db;
  } catch (error) {
    console.error('⚠️ Error conectando MongoDB:', error.message);
    console.log('🔄 Bot arrancará sin BD - se reconectará automáticamente');
    return null;
  }
}

export function getDB() {
  return db;
}

export async function closeDB() {
  if (client) await client.close();
}

// Torneos
export const Tournaments = {
  create: async (id, name, maxPlayers, guildId) => {
    return db.collection('tournaments').insertOne({
      id, name, maxPlayers, guildId, status: 'pending', createdAt: Date.now()
    });
  },
  getAll: async (guildId) => {
    return db.collection('tournaments').find({ guildId }).toArray();
  },
  getById: async (id) => {
    return db.collection('tournaments').findOne({ id });
  },
  update: async (id, data) => {
    return db.collection('tournaments').updateOne({ id }, { $set: data });
  },
  delete: async (id) => {
    return db.collection('tournaments').deleteOne({ id });
  }
};

// Equipos/Jugadores
export const Teams = {
  join: async (tournamentId, userId, teamName) => {
    return db.collection('teams').updateOne(
      { tournamentId, userId },
      { $set: { tournamentId, userId, teamName, joinedAt: Date.now() } },
      { upsert: true }
    );
  },
  leave: async (tournamentId, userId) => {
    return db.collection('teams').deleteOne({ tournamentId, userId });
  },
  getByTournament: async (tournamentId) => {
    return db.collection('teams').find({ tournamentId }).toArray();
  },
  getCount: async (tournamentId) => {
    const result = await db.collection('teams').countDocuments({ tournamentId });
    return result;
  }
};

// Partidas
export const Matches = {
  create: async (id, tournamentId, player1, player2) => {
    return db.collection('matches').insertOne({
      id, tournamentId, player1, player2, status: 'pending', createdAt: Date.now()
    });
  },
  getByTournament: async (tournamentId) => {
    return db.collection('matches').find({ tournamentId }).toArray();
  },
  setWinner: async (id, winner) => {
    return db.collection('matches').updateOne(
      { id },
      { $set: { winner, status: 'completed' } }
    );
  },
  findOne: async (query) => {
    return db.collection('matches').findOne(query);
  }
};

// Ranking
export const Ranking = {
  update: async (userId, wins, losses, rating) => {
    return db.collection('ranking').updateOne(
      { userId },
      { $set: { userId, wins, losses, rating, updatedAt: Date.now() } },
      { upsert: true }
    );
  },
  getAll: async () => {
    return db.collection('ranking').find({}).sort({ rating: -1 }).limit(100).toArray();
  },
  get: async (userId) => {
    return db.collection('ranking').findOne({ userId });
  }
};

// Players
export const Players = {
  getOrCreate: async (userId, name) => {
    let player = await db.collection('players').findOne({ userId });
    if (!player) {
      await db.collection('players').insertOne({
        userId, name, wins: 0, losses: 0, rating: 1500
      });
      player = await db.collection('players').findOne({ userId });
    }
    return player;
  }
};

export default db;
