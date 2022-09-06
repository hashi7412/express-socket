import * as mongodb from "mongodb";
import config from "../config.json";

const client = new mongodb.MongoClient("mongodb://localhost:27017");

const db = client.db(config.database);