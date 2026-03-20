import { Layer } from "effect";
import { Bot, BotDev, BotProd } from "./bot";

const DevConfig = Layer.mergeAll(BotDev);
const ProdConfig = Layer.mergeAll(BotProd);

export const Config = { Bot };

export const AppConfig =
  process.env.NODE_ENV === "production" ? ProdConfig : DevConfig;
