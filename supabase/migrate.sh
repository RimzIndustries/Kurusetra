#!/bin/bash

# Set environment variables
export SUPABASE_PROJECT_ID="mztynmhjxjpxhluyfdjc"
export SUPABASE_URL="https://mztynmhjxjpxhluyfdjc.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16dHlubWhqeGpweGhsdXlmZGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTA5MzAsImV4cCI6MjA1OTk2NjkzMH0.oBDoUhAZXz-nfxAVBflQz2HslUkmeENNhF4jOpbelPI"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Install Supabase CLI if not installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    npm install -g supabase-cli
fi

# Login to Supabase
supabase login

# Link project
supabase link --project-ref $SUPABASE_PROJECT_ID

# Run migrations
echo "Running migrations..."
supabase db push

# Verify migrations
echo "Verifying migrations..."
supabase db diff

# Enable RLS
echo "Enabling Row Level Security..."
supabase db reset

# Start local development
echo "Starting local development..."
supabase start

echo "Migration completed successfully!" 