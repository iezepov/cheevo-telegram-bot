hello:
	echo "Hello, World"
deploy:
	supabase functions deploy --no-verify-jwt telegram-bot
schema:
	npx supabase gen types typescript --project-id "xjoxqxqiouhzquhxmfhm" --schema public > supabase/functions/telegram-bot/database.types.ts