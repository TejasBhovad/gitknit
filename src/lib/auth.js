import { Client, Account, OAuthProvider } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

const account = new Account(client);

export function loginWithGithub() {
  account.createOAuth2Session(
    OAuthProvider.Github,
    `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    `${process.env.NEXT_PUBLIC_APP_URL}/signup`,
    ["repo", "user"], // scopes
  );
}

export function checkLoggedIn() {
  return account.get();
}

export { client, account };
