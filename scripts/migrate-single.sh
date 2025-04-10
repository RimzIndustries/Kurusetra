#!/bin/bash

# Check if a migration file was provided
if [ -z "$1" ]; then
  echo "Error: Please provide a migration file name"
  echo "Usage: ./migrate-single.sh 20240908000001_fix_rls_policies.sql"
  exit 1
fi

# Make scripts executable
chmod +x "$(dirname "$0")/run-with-env.sh"
chmod +x "$(dirname "$0")/run-single-migration.js"

# Run the migration script with environment variables
"$(dirname "$0")/run-with-env.sh" node "$(dirname "$0")/run-single-migration.js" "$1"
