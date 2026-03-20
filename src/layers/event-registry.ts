import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { type Event, isEvent } from "@structures/event";
import { Context, Effect, Layer } from "effect";

export class EventRegistry extends Context.Tag("EventRegistry")<
  EventRegistry,
  Map<string, Event>
>() {}

export const EventRegistryLive = Layer.effect(
  EventRegistry,
  Effect.gen(function* () {
    const eventsDir = join(import.meta.dir, "..", "events");
    const files = yield* Effect.promise(() =>
      readdir(eventsDir, { recursive: true })
    );

    const events = new Map<string, Event>();

    for (const file of files) {
      if (!file.endsWith(".ts")) {
        continue;
      }

      const exported = yield* Effect.promise(
        () => import(join(eventsDir, file))
      );

      for (const event of Object.values(exported)) {
        if (isEvent(event)) {
          if (events.has(event.name)) {
            yield* Effect.die(new Error(`Duplicate event: ${event.name}`));
          }
          events.set(event.name, event);
          yield* Effect.log(`Loaded event: ${event.name}`);
        }
      }
    }

    return events;
  })
);
