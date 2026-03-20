import { Client, GatewayIntentBits } from "discord.js";
import { Effect, Redacted } from "effect";
import { AppConfig, Config } from "./config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const startBot = Effect.gen(function* () {
  const bot = yield* Config.Bot;
  yield* Effect.tryPromise({
    try: () => client.login(Redacted.value(bot.token)),
    catch: () => new Error("Failed to login"),
  });
  yield* Effect.log(`Client started with user ${client.user?.username}`);
}).pipe(Effect.provide(AppConfig));

Effect.runPromise(startBot);
