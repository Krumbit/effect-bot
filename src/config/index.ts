import { Layer } from "effect";
import { BotDev, BotLive } from "./bot";

const DevConfig = Layer.mergeAll(BotDev);
const LiveConfig = Layer.mergeAll(BotLive);

export const Config =
  process.env.NODE_ENV === "production" ? LiveConfig : DevConfig;
