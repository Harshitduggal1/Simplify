import {
  boolean,
  integer,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
  decimal,
  serial,
} from "drizzle-orm/pg-core";
import { eq, sql } from "drizzle-orm";

// Base Users table
export const users = pgTable("users", {
  id: integer("id").primaryKey().notNull().default(sql`GENERATED ALWAYS AS IDENTITY`),
  clerkId: text("clerk_id").unique().notNull(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(''),
  username: text("username").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  points: integer("points").notNull().default(50),
  credits: integer("credits").default(30),
  profileImage: text("profile_image").default(''),
  subscription: boolean("subscription").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: integer("id").primaryKey().notNull().default(sql`GENERATED ALWAYS AS IDENTITY`),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Generated Content table
export const generatedContent = pgTable("generated_content", {
  id: integer("id").primaryKey().notNull().default(sql`GENERATED ALWAYS AS IDENTITY`),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text("content").notNull(),
  prompt: text("prompt").notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
//** email jobs table **//

export const emailJobs = pgTable('email_jobs', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }),
  status: varchar('status', { length: 50 }),
  sentAt: timestamp('sent_at'),
  error: text('error'),
  ip: varchar('ip', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow(),
  recipientCount: integer('recipient_count')
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: integer("id").primaryKey().notNull().default(sql`GENERATED ALWAYS AS IDENTITY`),
  sessionToken: text("session_token").unique().notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification Tokens table
export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
  compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type EmailJob = typeof emailJobs.$inferSelect;
export type NewEmailJob = typeof emailJobs.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type GeneratedContent = typeof generatedContent.$inferSelect;
export type NewGeneratedContent = typeof generatedContent.$inferInsert;
