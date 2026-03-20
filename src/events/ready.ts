import { Effect } from "effect";
import { Event } from "@/structures/event";

export const ready = Event.make({
  name: "clientReady",
  once: true,
  handle: (client) => Effect.log(`Logged in ${client.user.username}`),
});
