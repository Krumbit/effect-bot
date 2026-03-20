import { Config, Context, Layer, type Redacted } from "effect";

interface BotConfig {
  readonly clientId: Redacted.Redacted<string>;
  readonly guildId: string;
  readonly maxRetries: number;
  readonly token: Redacted.Redacted<string>;
}

export class Bot extends Context.Tag("bot")<Bot, BotConfig>() {}

export const BotDev = Layer.effect(
  Bot,
  Config.all({
    token: Config.redacted("BOT_TOKEN"),
    clientId: Config.redacted("CLIENT_ID"),
  }).pipe(
    Config.map((secrets) => ({
      ...secrets,
      maxRetries: 3,
      guildId: "1005350654417575968",
    }))
  )
);

export const BotLive = Layer.effect(
  Bot,
  Config.all({
    token: Config.redacted("BOT_TOKEN"),
    clientId: Config.redacted("CLIENT_ID"),
  }).pipe(
    Config.map((secrets) => ({
      ...secrets,
      maxRetries: 5,
      guildId: "1005350654417575968", // TODO: Change to live guild ID
    }))
  )
);
