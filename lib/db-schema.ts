import { pgTable, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  kvkkConsentAt: timestamp('kvkk_consent_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  packageType: text('package_type').notNull(),
  amountTry: integer('amount_try').notNull(),
  status: text('status').notNull().default('pending_payment'),
  paymentMethod: text('payment_method').notNull().default('bank_transfer'),
  paymentNotifiedAt: timestamp('payment_notified_at'),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  products: many(products),
}));

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  inputTitle: text('input_title').notNull(),
  inputDescription: text('input_description').notNull(),
  inputCategory: text('input_category'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  order: one(orders, { fields: [products.orderId], references: [orders.id] }),
  generations: many(generations),
}));

export const generations = pgTable('generations', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id),
  seoTitle: text('seo_title').notNull(),
  descriptionHtml: text('description_html').notNull(),
  keywords: jsonb('keywords').notNull().default('[]'),
  socialPosts: jsonb('social_posts').notNull().default('[]'),
  modelUsed: text('model_used').notNull(),
  status: text('status').notNull().default('queued'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const generationsRelations = relations(generations, ({ one }) => ({
  product: one(products, { fields: [generations.productId], references: [products.id] }),
}));

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  status: text('status').notNull().default('active'),
  monthlyQuota: integer('monthly_quota').notNull().default(50),
  usedThisMonth: integer('used_this_month').notNull().default(0),
  renewsAt: timestamp('renews_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));
