# GitKnit

Tool that allows you to push your discord server's threads to a centralised website for easy access. Consider it Stack overflow that indexes your discord server's threads. You select the a repository and the bot will push the threads of selected channel to the website.

> Consists of a discord bot and a website.

## Usage

1. Install the discord bot in your discord server. [Invite Link](https://discord.com/oauth2/authorize?client_id=1292501643224678492)
2. Initialise the bot in a forums channel(in any thread) using the `/init` command.
3. Follow the instructions to link the bot with your github repository.
4. Push the thread to the website using the `/push` command.

> Note: The discord bot is hosted by me locally, so it might not be available all the time.
> YI am working on creating a guide to host the bot on your own server.

### Discord Bot

Our Discord Bot is Open Source [here](https://github.com/TejasBhovad/gitknit-bot)

## Features

### Discord Bot

Created a discord bot that will give you access to the following commands:

- `/init`: to initialise the bot in a channel and link it with github repository.
- `/push`: to push the thread to the website.
- `/close`: to close the thread.

### Website

- Website that will display all the threads in a centralised location.
- In teh future, we can add search functionality to search for threads globally and give them better SEO.
- Also looking to add a feature that allows website users to interact with the threads.

## Tech Stack

- Discord Bot: Python, Appwrite, Discord API
- Website: Next.js, Tailwind CSS, Appwrite, tanstack/react-query
