import { sql } from 'drizzle-orm';

export async function up(db: any) {
  await sql`
    CREATE SEQUENCE IF NOT EXISTS users_id_seq;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY DEFAULT nextval('users_id_seq'),
      clerk_id TEXT NOT NULL UNIQUE,
      stripe_customer_id TEXT UNIQUE,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      points INTEGER DEFAULT 50,
      profile_image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ALTER SEQUENCE users_id_seq OWNED BY users.id;

    CREATE SEQUENCE IF NOT EXISTS subscriptions_id_seq;
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY DEFAULT nextval('subscriptions_id_seq'),
      -- ... rest of subscriptions table
    );
    ALTER SEQUENCE subscriptions_id_seq OWNED BY subscriptions.id;

    CREATE SEQUENCE IF NOT EXISTS generated_content_id_seq;
    CREATE TABLE IF NOT EXISTS generated_content (
      id INTEGER PRIMARY KEY DEFAULT nextval('generated_content_id_seq'),
      -- ... rest of generated_content table
    );
    ALTER SEQUENCE generated_content_id_seq OWNED BY generated_content.id;

    CREATE SEQUENCE IF NOT EXISTS email_jobs_id_seq;
    CREATE TABLE IF NOT EXISTS email_jobs (
      id INTEGER PRIMARY KEY DEFAULT nextval('email_jobs_id_seq'),
      -- ... rest of email_jobs table
    );
    ALTER SEQUENCE email_jobs_id_seq OWNED BY email_jobs.id;

    CREATE SEQUENCE IF NOT EXISTS conversion_metrics_id_seq;
    CREATE TABLE IF NOT EXISTS conversion_metrics (
      id INTEGER PRIMARY KEY DEFAULT nextval('conversion_metrics_id_seq'),
      -- ... rest of conversion_metrics table
    );
    ALTER SEQUENCE conversion_metrics_id_seq OWNED BY conversion_metrics.id;

    CREATE SEQUENCE IF NOT EXISTS video_data_id_seq;
    CREATE TABLE IF NOT EXISTS video_data (
      id INTEGER PRIMARY KEY DEFAULT nextval('video_data_id_seq'),
      -- ... rest of video_data table
    );
    ALTER SEQUENCE video_data_id_seq OWNED BY video_data.id;
  `;
}

export async function down(db: any) {
  await sql`
    DROP TABLE IF EXISTS video_data CASCADE;
    DROP TABLE IF EXISTS conversion_metrics CASCADE;
    DROP TABLE IF EXISTS email_jobs CASCADE;
    DROP TABLE IF EXISTS generated_content CASCADE;
    DROP TABLE IF EXISTS subscriptions CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    
    DROP SEQUENCE IF EXISTS video_data_id_seq;
    DROP SEQUENCE IF EXISTS conversion_metrics_id_seq;
    DROP SEQUENCE IF EXISTS email_jobs_id_seq;
    DROP SEQUENCE IF EXISTS generated_content_id_seq;
    DROP SEQUENCE IF EXISTS subscriptions_id_seq;
    DROP SEQUENCE IF EXISTS users_id_seq;
  `;
} 