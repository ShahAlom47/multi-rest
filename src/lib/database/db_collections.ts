
import { Collection, Db } from "mongodb";
import clientPromise from "./db_connection";
import { User } from "@/Interfaces/userInterfaces";


// Define the User type (you can extend it as needed)


export const getUserCollection = async (): Promise<Collection<User>> => {
  const client = await clientPromise;
  const db: Db = client.db("MultiRest"); // Replace with your database name
  return db.collection<User>("users");
};

