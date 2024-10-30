"use server";
import { NextResponse } from "next/server";
import { databases } from "@/db";
import { ID } from "appwrite";
import { Query } from "appwrite";
import { getUserByEmail } from "./user";
export async function addRepository({
  channel_id,
  email,
  name,
  is_private,
  source,
}) {
  try {
    if (!channel_id || !email || !name || !source) {
      throw new Error("Channel ID, email, name, and source must be provided");
    }

    const userDoc = await getUserByEmail({ email });
    if (!userDoc) {
      throw new Error("User not found in database");
    }
    const userId = userDoc["$id"];

    const check = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_REPOSITORIES_ID,
      [Query.equal("channel_id", channel_id), Query.equal("verified", true)],
    );

    if (check.total > 0) {
      return NextResponse.error(
        new Error("Repository already linked to channel"),
      );
    } else {
      let repository = {
        channel_id,
        name,
        is_private,
        source,
        users: userId,
      };
      const uniqueID = ID.unique();

      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_REPOSITORIES_ID,
        uniqueID,
        repository,
      );

      return response;
    }
  } catch (error) {
    console.error("Error adding repository to database:", error);
    return NextResponse.error(new Error("Failed to add repository"));
  }
}

export async function getRepositoriesByEmail({ email }) {
  console.log("Getting repositories by email:", email);
  try {
    if (!email) {
      throw new Error("Email must be provided");
    }

    const userDoc = await getUserByEmail({ email });
    if (!userDoc) {
      throw new Error("User not found in database");
    }
    // console.log("User found:", userDoc);
    const userId = userDoc["$id"];

    const check = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_REPOSITORIES_ID,
      [Query.equal("users", userId)],
    );
    // console.log("Repositories found:", check.documents);
    return check.documents;
  } catch (error) {
    console.error("Error getting repositories from database:", error);
    return [];
  }
}
