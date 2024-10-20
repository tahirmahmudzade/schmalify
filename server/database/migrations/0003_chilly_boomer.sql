CREATE UNIQUE INDEX `name_idx` ON `category` (`name`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `item` (`title`);--> statement-breakpoint
CREATE INDEX `description_idx` ON `item` (`description`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `item` (`category_id`);--> statement-breakpoint
CREATE INDEX `seller_idx` ON `item` (`seller_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `user` (`email`);