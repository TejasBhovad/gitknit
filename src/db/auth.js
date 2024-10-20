import { Client, Account, OAuthProvider } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT); // Your project ID

const account = new Account(client);

export function loginWithGithub() {
  // Go to OAuth provider login page
  account.createOAuth2Session(
    OAuthProvider.Github, // provider
    `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    `${process.env.NEXT_PUBLIC_APP_URL}/signup`,
    ["repo", "user"], // scopes
  );
}

export function checkLoggedIn() {
  return account.get();
}

export { client, account };
