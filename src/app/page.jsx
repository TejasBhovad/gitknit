import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  From Discord to the Web
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Push forum threads from Discord channels on the web
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  href="https://github.com/TejasBhovad/gitknit"
                  className="text-md my-2 rounded-md bg-accent px-4 py-2 font-bold text-white hover:bg-accent/90 sm:text-xl"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <li className="flex flex-col items-center space-y-2 rounded-lg border border-tertiary/75 p-4">
                <span className="text-2xl font-bold">1</span>
                <h3 className="text-xl font-bold">Connect Discord</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Link your Discord server to GitKnit with a few simple clicks.
                </p>
              </li>
              <li className="flex flex-col items-center space-y-2 rounded-lg border border-tertiary/75 p-4">
                <span className="text-2xl font-bold">2</span>
                <h3 className="text-xl font-bold">Select Channels</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Choose which forum channels you want to sync which Repository
                </p>
              </li>
              <li className="flex flex-col items-center space-y-2 rounded-lg border border-tertiary/75 p-4">
                <span className="text-2xl font-bold">3</span>
                <h3 className="text-xl font-bold">Push threads</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Using the discord bot we provide, push threads to the web
                </p>
              </li>
            </ol>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 GitKnit. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link
            className="text-xs underline-offset-4 hover:underline"
            href="https://github.com/TejasBhovad/gitknit"
          >
            Github
          </Link>
          <Link
            className="text-xs underline-offset-4 hover:underline"
            href="https://github.com/TejasBhovad/gitknit-bot"
          >
            Discord Bot
          </Link>
        </nav>
      </footer>
    </div>
  );
}
