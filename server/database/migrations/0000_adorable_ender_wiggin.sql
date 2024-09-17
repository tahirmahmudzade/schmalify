CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`img` text,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `guest` (
	`id` integer PRIMARY KEY NOT NULL,
	`first_name` text,
	`last_name` text,
	`phone` text NOT NULL,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(20) NOT NULL,
	`description` text(100),
	`price` integer NOT NULL,
	`category_id` text,
	`seller_id` text,
	`guest_id` integer,
	`condition` text,
	`status` text DEFAULT 'available',
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`seller_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guest`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`password` text NOT NULL,
	`username` text NOT NULL,
	`location` text,
	`avatar` text,
	`phone` text,
	`admin` integer DEFAULT false,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_id_unique` ON `category` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `category_name_unique` ON `category` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `guest_id_unique` ON `guest` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `item_id_unique` ON `item` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);