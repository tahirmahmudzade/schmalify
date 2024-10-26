CREATE TABLE `conversation` (
	`id` text PRIMARY KEY NOT NULL,
	`participants` text,
	`last_updated` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `conversation_id_unique` ON `conversation` (`id`);