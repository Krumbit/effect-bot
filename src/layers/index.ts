import { Layer } from "effect";
import { AppConfig } from "@/config";
import { CommandRegistryLive } from "./command-registry";
import { EventRegistryLive } from "./event-registry";

export const AppLayer = Layer.mergeAll(
  AppConfig,
  CommandRegistryLive,
  EventRegistryLive
);
