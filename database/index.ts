import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "@database/schema";

const expoDb = openDatabaseSync("attendance_tracker.db");

const db = drizzle(expoDb, { schema });

export { db };
