"use server";
// import { Account, AppwriteException, Client } from "node-appwrite";
// import { ID } from "node-appwrite";
// const client = new Client()
//   .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
//   .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

// export const getUserData = async () => {
//   try {
//     const account = new Account(client);
//     return await account.get();
//   } catch (error) {
//     if (error instanceof AppwriteException) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("An unexpected error occurred.");
//     }
//   }
// };

// export const login = async (email, password) => {
//   try {
//     const account = new Account(client);
//     return await account.createEmailSession(email, password);
//   } catch (error) {
//     if (error instanceof AppwriteException) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("An unexpected error occurred.");
//     }
//   }
// };

// export const logout = async () => {
//   try {
//     const account = new Account(client);
//     return await account.deleteSession("current");
//   } catch (error) {
//     if (error instanceof AppwriteException) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("An unexpected error occurred.");
//     }
//   }
// };

// export const register = async (email, password, name) => {
//   try {
//     const account = new Account(client);
//     const userAccount = await account.create(
//       ID.unique(),
//       email,
//       password,
//       name
//     );
//     console.log(userAccount);
//     return userAccount;
//   } catch (error) {
//     // throw new Error(error);
//     if (error instanceof AppwriteException) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("An unexpected error occurred.");
//     }
//   }
// };
"use server";
import { AppwriteException, ID } from "node-appwrite";
import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createAccount(formData) {
  const data = Object.fromEntries(formData.entries());
  const displayName = data.name;
  const email = data.email;
  const password = data.password;

  let accountCreated = false;

  try {
    const { account } = await createAdminClient();

    // Attempt to create a new user
    await account.create(ID.unique(), email, password, displayName);
    accountCreated = true;
    await account.createEmailPasswordSession(email, password);
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 409) {
      console.log("Email is already registered.");
      redirect("/signup?error=Email already registered");
    } else {
      console.error("Failed to create account:", error.message);
      redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    }
  }

  if (accountCreated) {
    redirect("/account"); // Redirect to account page after successful registration
  }
}

export async function loginWithEmail(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("gitknit-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    redirect("/account");
  } catch (error) {
    if (error instanceof AppwriteException) {
      if (error.code === 401) {
        // 401 Unauthorized indicates invalid credentials
        throw new Error("Invalid email or password. Please try again.");
      } else {
        throw new Error(error.message);
      }
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
