import type { Bot } from "@config/bot";
import type { CommandRegistry } from "@layers/command-registry";
import type { ClientEvents } from "discord.js";
import type { Effect } from "effect";

export type EventDeps = Bot | CommandRegistry;

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
  readonly handle: (
    ...args: ClientEvents[K]
  ) => Effect.Effect<void, never, EventDeps>;
  readonly name: K;
  readonly once?: boolean;
}

export const Event = {
  make: <K extends keyof ClientEvents>(options: Event<K>): Event<K> => options,
};

export const isEvent = (value: unknown): value is Event =>
  typeof value === "object" &&
  value !== null &&
  "name" in value &&
  "handle" in value &&
  typeof value.handle === "function" &&
  !("builder" in value); // distinguish from commands
