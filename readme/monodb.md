const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017"; // MongoDB URI
const client = new MongoClient(uri);

/**
 * Genel CRUD fonksiyon seti
 * @param {string} dbName - Veritabanı adı
 * @param {string} collectionName - Koleksiyon adı
 */
function createCRUD(dbName, collectionName) {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  return {
    // Create
    insertOne: async (doc) => await collection.insertOne(doc),
    insertMany: async (docs) => await collection.insertMany(docs),

    // Read
    find: async (filter = {}) => await collection.find(filter).toArray(),
    findOne: async (filter = {}) => await collection.findOne(filter),

    // Update
    updateOne: async (filter, update) => await collection.updateOne(filter, update),
    updateMany: async (filter, update) => await collection.updateMany(filter, update),

    // Delete
    deleteOne: async (filter) => await collection.deleteOne(filter),
    deleteMany: async (filter) => await collection.deleteMany(filter),
  };
}

async function runExample() {
  try {
    await client.connect();

    // Örnek: testDB ve users koleksiyonu için CRUD
    const usersCRUD = createCRUD("testDB", "users");

    // Create
    await usersCRUD.insertOne({ name: "Alice", age: 25 });
    await usersCRUD.insertMany([{ name: "Bob", age: 30 }, { name: "Carol", age: 22 }]);

    // Read
    const allUsers = await usersCRUD.find();
    console.log("All Users:", allUsers);

    const alice = await usersCRUD.findOne({ name: "Alice" });
    console.log("Alice:", alice);

    // Update
    await usersCRUD.updateOne({ name: "Alice" }, { $set: { age: 26 } });
    await usersCRUD.updateMany({ age: { $lt: 25 } }, { $set: { status: "young" } });

    // Delete
    await usersCRUD.deleteOne({ name: "Bob" });
    await usersCRUD.deleteMany({ age: { $gte: 30 } });

    const finalUsers = await usersCRUD.find();
    console.log("Final Users:", finalUsers);

  } finally {
    await client.close();
  }
}

runExample().catch(console.error);
