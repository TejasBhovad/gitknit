import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
async function signOut() {
  "use server";

  const { account } = await createSessionClient();

  cookies().delete("gitknit-session");
  await account.deleteSession("current");

  redirect("/signup");
}

export default async function HomePage() {
  const user = await getLoggedInUser();
  if (!user) redirect("/signup");

  return (
    <>
      <ul>
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>Name:</strong> {user.name}
        </li>
        <li>
          <strong>ID: </strong> {user.$id}
        </li>
      </ul>

      <form action={signOut}>
        <Button
          type="submit"
          className="h-auto w-auto rounded-sm text-sm font-semibold"
        >
          Sign Out
        </Button>
      </form>
    </>
  );
}
