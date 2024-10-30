"use server";

import { databases } from "@/db";
import { ID } from "appwrite";
import { Query } from "appwrite";

export async function addUserToDatabase({ name, email }) {
  try {
    if (!name || !email) {
      throw new Error("Name and email must be provided");
    }

    let user_entry = {
      name: name,
      email: email,
    };

    const uniqueID = ID.unique();

    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_ID,
      uniqueID,
      user_entry,
    );

    return response;
  } catch (error) {
    console.error("Error adding user to database:", error);
    throw error; // Rethrow error for further handling
  }
}
export async function getUserByEmail({ email }) {
  console.log("Getting user by email:", email);
  try {
    if (!email) {
      throw new Error("Email must be provided");
    }

    const check = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_ID,
      [Query.equal("email", email)],
    );

    if (check.total > 0) {
      return check.documents[0]; // Return the existing user document
    } else {
      return null; // No user found
    }
  } catch (error) {
    console.error("Error getting user from database:", error);
    throw error; // Rethrow error for further handling
  }
}
