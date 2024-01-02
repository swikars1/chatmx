import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { ulid } from "ulidx";

export const chatRoom = sqliteTable(
  "chat_room",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => ulid()),
    creatorId: text("creator_id").notNull(),
    capacity: integer("capacity", { mode: "number" }).$defaultFn(() => 2),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => {
    return {
      creatorIdx: index("creator_idx").on(table.creatorId),
      createdAtIdx: index("created_at_idx").on(table.createdAt),
    };
  }
);
export type ChatRoom = typeof chatRoom.$inferSelect;
export type InsertChatRoom = typeof chatRoom.$inferInsert;

export const insertChatRoomSchema = createInsertSchema(chatRoom);
export const selectChatRoomSchema = createSelectSchema(chatRoom);
