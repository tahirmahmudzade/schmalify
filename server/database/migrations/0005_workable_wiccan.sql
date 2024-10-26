CREATE INDEX `last_updated_idx` ON `conversation` (`last_updated`);--> statement-breakpoint
CREATE INDEX `participants_idx` ON `conversation` (`participants`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `user` (`username`);