import { Client, Account, OAuthProvider, Models } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "");

const account = new Account(client);

export async function loginWithGithub() {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("NEXT_PUBLIC_APP_URL environment variable is not set");
  }
  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account`;
  const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup`;

  try {
    return await account.createOAuth2Session(
      OAuthProvider.Github,
      successUrl,
      failureUrl,
      ["repo", "user", "account"],
    );
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    throw new Error("Failed to initiate GitHub login");
  }
}

export async function checkLoggedIn() {
  console.log("Checking login status...");

  try {
    // First check if there's an active session
    const session = await account.getSession("current");
    // console.log("Active session found:", session);

    const user = await account.get();
    // console.log("User details retrieved:", user);

    return {
      user: {
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login check error:", error);

    if (error?.code === 401) {
      return { user: null, error: "User not authenticated" };
    }
    if (error?.code === 429) {
      return { user: null, error: "Rate limit exceeded" };
    }

    return {
      user: null,
      error: "Authentication check failed",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function logout() {
  console.log("Initiating logout...");

  try {
    await account.deleteSession("current");
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);

    if (error?.code === 401) {
      console.log("User already logged out");
      return;
    }

    throw new Error("Failed to logout");
  }
}

export async function isAuthenticated() {
  try {
    const session = await account.getSession("current");
    return Boolean(session);
  } catch {
    return false;
  }
}

export { account };
