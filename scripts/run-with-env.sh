#!/bin/bash

# This script ensures environment variables are properly set before running migrations

# Check if we have the required environment variables
if [ -z "$VITE_SUPABASE_URL" ] && [ -z "$SUPABASE_URL" ]; then
  echo "Error: Neither VITE_SUPABASE_URL nor SUPABASE_URL is set"
  exit 1
fi

if [ -z "$SUPABASE_SERVICE_KEY" ] && [ -z "$SUPABASE_KEY" ] && [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "Error: None of SUPABASE_SERVICE_KEY, SUPABASE_KEY, or SUPABASE_ANON_KEY is set"
  exit 1
fi

# Export variables with consistent names if they're not already set
if [ -z "$VITE_SUPABASE_URL" ] && [ ! -z "$SUPABASE_URL" ]; then
  export VITE_SUPABASE_URL=$SUPABASE_URL
fi

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
  if [ ! -z "$SUPABASE_KEY" ]; then
    export SUPABASE_SERVICE_KEY=$SUPABASE_KEY
  elif [ ! -z "$SUPABASE_ANON_KEY" ]; then
    export SUPABASE_SERVICE_KEY=$SUPABASE_ANON_KEY
  fi
fi

# Run the requested command with the environment variables set
echo "Running: $@"
"$@"
