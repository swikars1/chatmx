import { relations } from "drizzle-orm";
import { user } from "./auth";
import { chatRoom } from "./chatRooms";

export { chatRoom } from "./chatRooms";

export { key, session, user } from "./auth";

export const userRelations = relations(user, ({ one }) => ({
  chatRoom: one(chatRoom, {
    fields: [user.chatRoomId],
    references: [chatRoom.id],
  }),
}));

export const chatRoomsRelations = relations(chatRoom, ({ one, many }) => ({
  creator: one(user, {
    fields: [chatRoom.creatorId],
    references: [user.id],
  }),
  member: many(user, {
    relationName: "member",
  }),
}));
