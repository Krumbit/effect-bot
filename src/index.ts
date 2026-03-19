import { Bot } from "@config/bot";
import { Client, GatewayIntentBits } from "discord.js";
import { Effect, Redacted } from "effect";
import { Config } from "./config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const startBot = Effect.gen(function* () {
  const bot = yield* Bot;
  yield* Effect.tryPromise({
    try: () => client.login(Redacted.value(bot.token)),
    catch: () => new Error("Failed to login"),
  });
  yield* Effect.log(`Client started with user ${client.user?.username}`);
});

Effect.runPromise(startBot.pipe(Effect.provide(Config)));
