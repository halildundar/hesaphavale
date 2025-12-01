import { MongoClient, ObjectId } from "mongodb";
import { getDateRange } from "./genel/timeIslemler.js";
import {BehaviorSubject,fromEventPattern} from "rxjs";
import {switchMap} from "rxjs/operators";
const uri = "mongodb://127.0.0.1:27017/?directConnection=true";
// const uri = "mongodb://127.0.0.1:27017/?replicaSet=rs0&readPreference=primary";
const client = new MongoClient(uri);

/**
 * Genel CRUD fonksiyon seti
 * @param {string} dbName - Veritabanı adı
 * @param {string} collectionName - Koleksiyon adı
 */
export function CRUD(dbName, collectionName) {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  return {
    db: db,
    collection: collection,
    aggregate: async (filter = {}, lookup = {}, addfields = {}) =>
      await collection
        .aggregate([
          { $match: filter },
          { $lookup: lookup },
          { $addFields: addfields },
        ])
        .toArray(),
    watchWithAggregate: (collection, aggregatePipeline, callback) => {
      collection
        .watch([], { fullDocument: "updateLookup" })
        .on("change", async (change) => {
          const data = await collection
            .aggregate([
              { $match: { _id: change.documentKey._id } },
              ...aggregatePipeline,
            ])
            .toArray();

          callback(data[0]);
        });
    },
    // Create
    insertOne: async (doc) => await collection.insertOne(doc),
    insertMany: async (docs) => await collection.insertMany(docs),

    // Read
    find: async (filter = {}, projection = {},sort = {}) =>
      await collection.find(filter, { projection: projection }).sort({...sort}).toArray(),
    findOne: async (filter = {}, projection = {}) =>
      await collection.findOne(filter, { projection: projection }),

    // Update
    updateOne: async (filter, update) =>
      await collection.updateOne(filter, update),
    updateMany: async (filter, update) =>
      await collection.updateMany(filter, update),

    // Replace
    replaceOne: async (filter, update) =>
      await collection.replaceOne(filter, update),
    replaceMany: async (filter, update) =>
      await collection.replaceMany(filter, update),

    // Delete
    deleteOne: async (filter) => await collection.deleteOne(filter),
    deleteMany: async (filter) => await collection.deleteMany(filter),

    //Watch
    watch: () =>
      collection.watch([], {
        fullDocument: "updateLookup",
      }),
  };
}

export const ObjectID = (_id) => {
  if (!!_id) {
    return new ObjectId(_id);
  }
  return new ObjectId();
};

export class MongoWatchService {
  /**
   * @param {string} uri MongoDB connection string
   * @param {string} dbName Database name
   * @param {string} collectionName Collection to watch
   */
  constructor(collecName) {
    this.db = client.db("hesaphavale");
    this.collection = this.db.collection(collecName);
    // Dynamic filter için BehaviorSubject
    this.filter$ = new BehaviorSubject({});
  }

  /**
   * Set dynamic filter by date range type
   * @param {string} rangeType 'yesterday' | 'today' | 'lastMonth' | 'thisMonth' | 'lastWeek' | 'thisWeek'
   * @param {boolean} useEndFilter true ise end tarihine kadar filtre uygular
   */
  setFilterByDateRange(rangeType = "yesterday", useEndFilter = false) {
    const range = getDateRange(rangeType, "Europe/Istanbul");
    const filter = {
      "fullDocument.activityDateTime": {
        $gte: range.trStartNoOffset,
      },
    };

    if (useEndFilter) {
      filter["fullDocument.activityDateTime"].$lte = range.trEndNoOffset;
    }
    this.filter$.next(filter);
  }

  /**
   * Returns an RxJS observable of change events
   */
  watch() {
    return this.filter$.pipe(
      switchMap((filter) => {
        console.log(filter)
        const pipeline = [{ $match: filter }];
        const changeStream = this.collection.watch(pipeline, {
          fullDocument: "updateLookup",
        });

        return fromEventPattern(
          (handler) => changeStream.on("change", handler),
          (handler) => changeStream.off("change", handler)
        );
      })
    );
  }

}
