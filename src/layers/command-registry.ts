import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { type Command, isCommand } from "@structures/command";
import { Context, Effect, Layer } from "effect";

export class CommandRegistry extends Context.Tag("CommandRegistry")<
  CommandRegistry,
  Map<string, Command>
>() {}

export const CommandRegistryLive = Layer.effect(
  CommandRegistry,
  Effect.gen(function* () {
    const commandsDir = join(import.meta.dir, "..", "commands");
    const files = yield* Effect.promise(() =>
      readdir(commandsDir, { recursive: true })
    );

    const commands = new Map<string, Command>();

    for (const file of files) {
      if (!file.endsWith(".ts")) {
        continue;
      }

      const exported = yield* Effect.promise(
        () => import(join(commandsDir, file))
      );

      for (const command of Object.values(exported)) {
        if (isCommand(command)) {
          if (commands.has(command.name)) {
            yield* Effect.die(new Error(`Duplicate command: /${command.name}`));
          }
          commands.set(command.name, command);
          yield* Effect.log(`Loaded command: /${command.name}`);
        }
      }
    }

    return commands;
  })
);
