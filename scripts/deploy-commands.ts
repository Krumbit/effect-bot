import { REST, Routes } from "discord.js";
import { Effect, Redacted } from "effect";
import { Bot } from "../src/config/bot.ts";
import { AppConfig } from "../src/config/index.ts";
import { loadCommands } from "../src/utils/loader.ts";

const deploy = Effect.gen(function* () {
  const bot = yield* Bot;
  const commandMap = yield* loadCommands;

  const body = [...commandMap.values()].flatMap((command) =>
    command.builder ? [command.builder.toJSON()] : []
  );

  const rest = new REST().setToken(Redacted.value(bot.token));

  yield* Effect.log(
    `Started refreshing ${body.length} application (/) commands.`
  );

  const data = yield* Effect.tryPromise({
    try: () =>
      rest.put(
        Routes.applicationGuildCommands(
          Redacted.value(bot.clientId),
          bot.guildId
        ),
        { body }
      ),
    catch: (cause) =>
      new Error("Failed to deploy application commands", {
        cause,
      }),
  });

  const count = Array.isArray(data) ? data.length : 0;
  yield* Effect.log(`Successfully reloaded ${count} application (/) commands.`);
}).pipe(Effect.provide(AppConfig));

Effect.runPromise(deploy);
