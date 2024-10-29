"use server";

import { databases } from "@/db";
import { ID } from "appwrite";
import { Query } from "appwrite";

export async function addUserToDatabase(user) {
  const { name, email } = user;

  try {
    const check = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_USER_ID,
      [Query.equal("user_email", user.email)],
    );

    if (check.total > 0) {
      return;
    } else {
      let user_entry = {
        username: name,
        user_email: email,
      };
      const uniqueID = ID.unique();

      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_USER_COLLECTION_ID,
        uniqueID,
        user_entry,
      );

      return response;
    }
  } catch (error) {
    console.error("Error adding user to database:", error);
  }
}
