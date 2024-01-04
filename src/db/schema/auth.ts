import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulidx";
import { chatRoom } from ".";

export const user = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  handle: text("handle")
    .notNull()
    .unique()
    .$defaultFn(() => ulid()),
  name: text("name").notNull(),
  picture: text("name").notNull(),
  email: text("email"),
  chatRoomId: text("chat_room_id").references(() => chatRoom.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const session = sqliteTable("user_session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
});

export const key = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  hashedPassword: text("hashed_password"),
});
