import { MessageFlags } from "discord.js";
import { Effect } from "effect";
import { Command } from "@/structures/command";

export const ping = Command.make({
  name: "ping",
  description: "Simple ping command",
  execute: (interaction) =>
    Effect.promise(() =>
      interaction.reply({ content: "Pong", flags: MessageFlags.Ephemeral })
    ),
});
