#!/bin/bash

# Make scripts executable
chmod +x "$(dirname "$0")/run-with-env.sh"
chmod +x "$(dirname "$0")/apply-all-migrations.js"

# Run the migration script with environment variables
"$(dirname "$0")/run-with-env.sh" node "$(dirname "$0")/apply-all-migrations.js"
