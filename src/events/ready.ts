import { Event } from "@structures/event";
import { Effect } from "effect";

export const ready = Event.make({
  name: "clientReady",
  once: true,
  handle: (client) => Effect.log(`Logged in ${client.user.username}`),
});
