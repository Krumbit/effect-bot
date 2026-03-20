import { Client, GatewayIntentBits } from "discord.js";
import { Effect, Redacted, Runtime } from "effect";
import { Config } from "./config";
import { AppLayer } from "./layers";
import { EventRegistry } from "./layers/event-registry";
import type { EventDeps } from "./structures/event";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const startBot = Effect.gen(function* () {
  const bot = yield* Config.Bot;
  const events = yield* EventRegistry;
  const runtime = yield* Effect.runtime<EventDeps>();
  const runPromise = Runtime.runPromise(runtime);

  for (const event of events.values()) {
    const method = event.once ? "once" : "on";
    client[method](event.name, (...args) => {
      runPromise(event.handle(...args)).catch(console.error);
    });
  }

  yield* Effect.promise(() => client.login(Redacted.value(bot.token)));
}).pipe(Effect.provide(AppLayer));

Effect.runPromise(startBot);
