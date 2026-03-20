import { Layer } from "effect";
import { Bot, BotDev, BotLive } from "./bot";

const DevConfig = Layer.mergeAll(BotDev);
const LiveConfig = Layer.mergeAll(BotLive);

export const Config = { Bot };

export const AppConfig =
  process.env.NODE_ENV === "production" ? LiveConfig : DevConfig;
