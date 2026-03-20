import { Command } from "@structures/command";
import { MessageFlags } from "discord.js";
import { Effect } from "effect";

export const ping = Command.make({
  name: "ping",
  description: "Simple ping command",
  execute: (interaction) => {
    return Effect.promise(() =>
      interaction.reply({ content: "Pong", flags: MessageFlags.Ephemeral })
    );
  },
});
