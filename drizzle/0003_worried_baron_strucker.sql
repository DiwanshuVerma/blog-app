ALTER TABLE "posts" RENAME COLUMN "provider_author_id" TO "author_id";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_provider_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "provider_account_id";