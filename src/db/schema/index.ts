import { relations } from "drizzle-orm";
import { users } from "./auth";
import { chatRooms } from "./chatRooms";

export { chatRooms } from "./chatRooms";

export { key, session, users } from "./auth";

export const userRelations = relations(users, ({ many }) => ({
  chatRooms: many(chatRooms),
}));

export const chatRoomsRelations = relations(chatRooms, ({ one, many }) => ({
  creator: one(users, {
    fields: [chatRooms.creatorId],
    references: [users.id],
  }),
  member: many(users, {
    relationName: "member",
  }),
}));
