import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable(
  'user',
  {
    id: text('id').primaryKey().unique(),
    email: text('email').unique(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    password: text('password'),
    username: text('username'),
    location: text('location'), // optional, could help filter by location
    avatar: text('avatar'), // optional profile picture
    phone: text('phone'), // optional contact number
    passwordResetToken: text('password_reset_token'),
    admin: integer('admin', { mode: 'boolean' }).default(false),
    isGuest: integer('is_guest', { mode: 'boolean' }).default(false),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  table => {
    return { emailIdx: uniqueIndex('email_idx').on(table.email), usernameIdx: index('username_idx').on(table.username) }
  },
)

export const item = sqliteTable(
  'item',
  {
    id: text('id').primaryKey().unique(),
    title: text('title', { length: 35 }).notNull(),
    description: text('description', { length: 400 }),
    images: text('image', { mode: 'json' })
      .$type<string[]>()
      .default(sql`(json_array())`), // optional image for item
    price: integer('price').notNull(), // store price as integer for cents (e.g., 1000 = €10.00)
    category_id: text('category_id').references(() => category.id, { onDelete: 'set null', onUpdate: 'cascade' }), // link to category table
    seller_id: text('seller_id').references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }), // user selling the item
    condition: text('condition', { enum: ['new', 'like new', 'very good', 'good', 'fair', 'poor'] }), // e.g., new, like new, used
    status: text('status', { enum: ['available', 'sold'] }).default('available'), // e.g., available, sold
    createdAt: text('created_at').default(sql`(datetime('now'))`),
    pending: integer('pending', { mode: 'boolean' }).default(true),
  },
  table => {
    return {
      titleIdx: index('title_idx').on(table.title),
      descriptionIdx: index('description_idx').on(table.description),
      categoryIdx: index('category_idx').on(table.category_id),
      sellerIdx: index('seller_idx').on(table.seller_id),
    }
  },
)

export const category = sqliteTable(
  'category',
  {
    id: text('id').primaryKey().unique(),
    name: text('name').notNull().unique(),
    img: text('img'), // optional image for category
    createdAt: text('created_at').default(sql`(datetime('now'))`),
  },
  table => {
    return { nameIdx: uniqueIndex('name_idx').on(table.name) }
  },
)

export const conversation = sqliteTable(
  'conversation',
  {
    id: text('id').primaryKey().unique(),
    participants: text('participants', { mode: 'json' }).$type<string[]>(), // Array of user IDs
    lastUpdated: text('last_updated').default(sql`(datetime('now'))`),
  },
  table => {
    return {
      lastUpdatedIdx: index('last_updated_idx').on(table.lastUpdated),
      participantsIdx: index('participants_idx').on(table.participants),
    }
  },
)

export const userRelations = relations(user, ({ many }) => ({
  items: many(item),
  // transactions: many(transaction),
  // sentMessages: many(message),
  // receivedMessages: many(message),
  // reviews: many(review),
}))

export const itemRelations = relations(item, ({ one }) => ({
  category: one(category, { fields: [item.category_id], references: [category.id] }),
  seller: one(user, { fields: [item.seller_id], references: [user.id] }),
  // transaction: one(transaction),
}))

export const categoryRelations = relations(category, ({ many }) => ({
  items: many(item), // a category can have many items
}))

// export const transaction = sqliteTable('transaction', {
//   id: text('id').primaryKey().unique(),
//   buyer_id: text('buyer_id').references(() => user.id), // user buying the item
//   seller_id: text('seller_id').references(() => user.id), // user selling the item
//   item_id: text('item_id').references(() => item.id), // item being sold
//   price: integer('price').notNull(),
//   status: text('status').default('pending'), // e.g., pending, completed, cancelled
//   createdAt: text('created_at').default(sql`(datetime('now'))`),
// })

// export const message = sqliteTable('message', {
//   id: text('id').primaryKey().unique(),
//   sender_id: text('sender_id').references(() => user.id),
//   receiver_id: text('receiver_id').references(() => user.id),
//   content: text('content').notNull(),
//   createdAt: text('created_at').default(sql`(datetime('now'))`),
// })

// export const review = sqliteTable('review', {
//   id: text('id').primaryKey().unique(),
//   transaction_id: text('transaction_id').references(() => transaction.id),
//   reviewer_id: text('reviewer_id').references(() => user.id),
//   rating: integer('rating').notNull(), // e.g., 1-5 star rating
//   comment: text('comment'),
//   createdAt: text('created_at').default(sql`(datetime('now'))`),
// })

// export const transactionRelations = relations(transaction, ({ one }) => ({
//   buyer: one(user),
//   seller: one(user),
//   item: one(item),
//   review: one(review),
// }))

// export const messageRelations = relations(message, ({ one }) => ({
//   sender: one(user),
//   receiver: one(user),
// }))

// export const reviewRelations = relations(review, ({ one }) => ({
//   transaction: one(transaction),
//   reviewer: one(user),
// }))
