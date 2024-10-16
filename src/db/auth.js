"use server";
import { z } from "zod";
import { AppwriteException, ID } from "node-appwrite";
import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Define validation schemas
const createAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginWithEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createAccount(formData) {
  // Validate form data
  const result = createAccountSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  });

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => err.message)
      .join(", ");
    redirect(`/signup?error=${encodeURIComponent(errorMessage)}`);
    return;
  }

  const { email, password, name } = result.data;
  let accountCreated = false;

  try {
    const { account } = await createAdminClient();

    // Attempt to create a new user
    await account.create(ID.unique(), email, password, name);
    accountCreated = true;
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("gitknit-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
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
  // Validate form data
  const result = loginWithEmailSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => err.message)
      .join(", ");
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
    return;
  }

  const { email, password } = result.data;
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("gitknit-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    if (session.userId) {
      // redirect("/account");
      return session;
    }
  } catch (error) {
    if (error instanceof AppwriteException) {
      if (error.code === 401) {
        // 401 Unauthorized indicates invalid credentials
        console.log("Invalid email or password.");
        redirect("/signup?error=Invalid email or password");
      } else {
        throw new Error(error.message);
      }
    } else {
      // throw new Error(error.message);
    }
  }
}

export async function signUpWithGithub() {
  try {
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;
    await account.createOAuth2Session("github", callbackUrl, callbackUrl);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return {
      error: error.message || "GitHub authentication failed",
    };
  }
}
