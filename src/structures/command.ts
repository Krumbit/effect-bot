import type { Bot } from "@config/bot";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type { Effect } from "effect";

type CommandDeps = Bot;

export interface Command {
  readonly builder?: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  readonly description: string;
  readonly execute: (
    interaction: ChatInputCommandInteraction
  ) => Effect.Effect<void, never, CommandDeps>;
  readonly name: string;
}

const getBuilderFromOptions = (options: Command) => {
  return new SlashCommandBuilder()
    .setName(options.name)
    .setDescription(options.description);
};

export const Command = {
  make: (options: Command): Command => ({
    builder: getBuilderFromOptions(options),
    ...options,
  }),
};
