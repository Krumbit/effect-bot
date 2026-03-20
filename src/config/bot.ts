import { Config, Context, Layer, type Redacted } from "effect";

interface BotConfig {
  readonly clientId: Redacted.Redacted<string>;
  readonly guildId: string;
  readonly token: Redacted.Redacted<string>;
}

export class Bot extends Context.Tag("bot")<Bot, BotConfig>() {}

export const BotDev = Layer.effect(
  Bot,
  Config.all({
    token: Config.redacted("BOT_TOKEN"),
    clientId: Config.redacted("CLIENT_ID"),
    guildId: Config.string("GUILD_ID"),
  }).pipe(
    Config.map((secrets) => ({
      ...secrets,
      // Add more config values below
    }))
  )
);

export const BotProd = Layer.effect(
  Bot,
  Config.all({
    token: Config.redacted("BOT_TOKEN"),
    clientId: Config.redacted("CLIENT_ID"),
    guildId: Config.string("GUILD_ID"),
  }).pipe(
    Config.map((secrets) => ({
      ...secrets,
      // Add more config values below
    }))
  )
);
