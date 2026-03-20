# Effect Bot

A Discord bot built with [Effect](https://effect.website/) and [discord.js](https://discord.js.org/), running on [Bun](https://bun.sh/). A learning project for exploring Effect's approach to dependency injection, layered architecture, and typed error handling.

## Prerequisites

- [Bun](https://bun.sh/) (latest)
- A [Discord application](https://discord.com/developers/applications) with a bot token

## Setup

1. Install dependencies:

   ```sh
   bun install
   ```

2. Copy the example env file and fill in your values:

   ```sh
   cp .env.example .env.local
   ```

   | Variable    | Description                          |
   | ----------- | ------------------------------------ |
   | `NODE_ENV`  | `development` or `production`        |
   | `BOT_TOKEN` | Your Discord bot token               |
   | `CLIENT_ID` | Your Discord application's client ID |
   | `GUILD_ID`  | The server to register commands in   |

3. Deploy slash commands to your guild:

   ```sh
   bun run deploy:dev
   ```

4. Start the bot:

   ```sh
   bun run dev
   ```

## Project Structure

```
src/
├── index.ts              # Entry point — creates the client and wires up layers
├── config/
│   ├── index.ts          # Exports AppConfig (dev/prod) and Config namespace
│   └── bot.ts            # Bot service tag + config layers (token, clientId, guildId)
├── structures/
│   ├── command.ts        # Command interface and factory
│   └── event.ts          # Event interface and factory
├── layers/
│   ├── index.ts          # Merges AppConfig + registries into AppLayer
│   ├── command-registry.ts  # Auto-discovers commands from src/commands/
│   └── event-registry.ts    # Auto-discovers events from src/events/
├── commands/
│   └── ping.ts           # Example slash command
├── events/
│   ├── ready.ts          # Logs when the bot connects
│   └── interactionCreate.ts  # Routes interactions to commands
scripts/
└── deploy-commands.ts    # Registers slash commands with the Discord API
```

## Adding a Command

Create a new file in `src/commands/` — it will be auto-discovered at startup.

```ts
// src/commands/hello.ts
import { MessageFlags } from "discord.js";
import { Effect } from "effect";
import { Command } from "@/structures/command";

export const hello = Command.make({
  name: "hello",
  description: "Say hello",
  execute: (interaction) =>
    Effect.promise(() =>
      interaction.reply({ content: "Hello!", flags: MessageFlags.Ephemeral })
    ),
});
```

Then redeploy commands so Discord knows about it:

```sh
bun run deploy:dev
```

## Adding an Event

Create a new file in `src/events/` — also auto-discovered.

```ts
// src/events/messageCreate.ts
import { Effect } from "effect";
import { Event } from "@/structures/event";

export const messageCreate = Event.make({
  name: "messageCreate",
  handle: (message) => Effect.log(`Message from ${message.author.username}`),
});
```

## Scripts

| Script             | Description                                |
| ------------------ | ------------------------------------------ |
| `bun run dev`      | Start the bot                              |
| `bun run deploy:dev`  | Deploy slash commands (guild, development) |
| `bun run deploy:prod` | Deploy slash commands (guild, production)  |
| `bun run check`    | Lint/format check via ultracite            |
| `bun run fix`      | Auto-fix lint/format issues                |

## How It Works

The bot uses Effect's **Layer** system for dependency injection:

- **`Config.Bot`** — provides bot credentials from environment variables
- **`CommandRegistry`** — scans `src/commands/` and builds a `Map<string, Command>`
- **`EventRegistry`** — scans `src/events/` and builds a `Map<string, Event>`
- **`AppLayer`** — merges all the above into a single layer provided to the main program

At startup, the bot iterates over registered events and binds them to the Discord client. Commands are resolved from the registry when an `interactionCreate` event fires.
