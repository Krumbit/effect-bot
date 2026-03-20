import { Effect } from "effect";
import { CommandRegistry } from "@/layers/command-registry";
import { Event } from "@/structures/event";

export const interactionCreate = Event.make({
  name: "interactionCreate",
  handle: (interaction) =>
    Effect.gen(function* () {
      // TODO: Update for context menus, modals, etc
      if (!interaction.isChatInputCommand()) {
        return;
      }

      const commands = yield* CommandRegistry;
      const command = commands.get(interaction.commandName);
      if (!command) {
        return;
      }

      yield* Effect.log(
        `@${interaction.user.username} executed /${interaction.commandName}`
      );
      yield* command.execute(interaction);
    }),
});
