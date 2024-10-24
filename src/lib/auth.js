import { Client, Account, OAuthProvider, Models } from "appwrite";
import { NextResponse } from "next/server";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "");

const account = new Account(client);

export async function loginWithGithub() {
  const successUrl = new URL(
    "/account",
    process.env.NEXT_PUBLIC_APP_URL ?? "",
  ).toString();
  const failureUrl = new URL(
    "/signup",
    process.env.NEXT_PUBLIC_APP_URL ?? "",
  ).toString();

  try {
    await account.createOAuth2Session(
      OAuthProvider.Github,
      successUrl,
      failureUrl,
      ["repo", "user"],
    );
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    throw new Error("Failed to initiate GitHub login");
  }
}

export async function checkLoggedIn() {
  try {
    const user = await account.get();
    return { user };
  } catch (error) {
    // Handle specific error cases
    if (error?.code === 401) {
      return { user: null, error: "User not authenticated" };
    }
    if (error?.code === 429) {
      return { user: null, error: "Rate limit exceeded" };
    }

    console.error("Authentication check failed:", error);
    return { user: null, error: "Authentication check failed" };
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    // Handle specific logout errors
    if (error?.code === 401) {
      // User is already logged out, no need to throw
      return;
    }
    console.error("Logout failed:", error);
    throw new Error("Failed to logout");
  }
}

export async function isAuthenticated() {
  const { user, error } = await checkLoggedIn();
  return Boolean(user);
}

export { client, account };
