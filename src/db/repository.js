"use server";
import { NextResponse } from "next/server";
import { databases } from "@/db";
import { ID } from "appwrite";
import { Query } from "appwrite";

export async function addRepository({
  channel_id,
  email,
  name,
  is_private,
  source,
}) {
  try {
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
  }
}
