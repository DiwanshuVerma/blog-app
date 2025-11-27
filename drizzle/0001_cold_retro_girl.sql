ALTER TABLE "posts" RENAME COLUMN "author_id" TO "provider_author_id";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_provider_author_id_users_id_fk" FOREIGN KEY ("provider_author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;