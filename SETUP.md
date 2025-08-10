# Hockey Analytics Setup Guide

## Supabase Environment Configuration

To use the interactive shot map and API features, you need to configure your Supabase connection.

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

### Step 3: Set Up Your Database

Make sure your Supabase project has the `nhl_shots_2024` table set up. You can use the data migration scripts in the `data-migrations/` folder to import NHL shot data.

### Step 4: Start Development Server

```bash
npm run dev
```

The interactive heat map should now load with data from your Supabase database!

## Troubleshooting

- **"Supabase configuration missing"**: Make sure your `.env.local` file exists and contains the correct values
- **"Failed to fetch shot data"**: Check that your database table exists and contains data
- **API key errors**: Ensure you're using the **anon public** key, not the service role key

## File Structure

- `.env.local` - Your actual environment variables (not committed to git)
- `.env.example` - Template showing required variables
- `data-migrations/.env.template` - Environment template for data import scripts
