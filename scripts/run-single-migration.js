#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Get the migration file from command line arguments
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error(
    "Please provide a migration file name (e.g., 20240908000001_fix_rls_policies.sql)",
  );
  process.exit(1);
}

// Path to migrations directory
const migrationsDir = path.join(__dirname, "..", "supabase", "migrations");
const fullPath = path.join(migrationsDir, migrationFile);

// Check if the file exists
if (!fs.existsSync(fullPath)) {
  console.error(`Migration file ${fullPath} does not exist`);
  process.exit(1);
}

console.log(`Applying migration: ${migrationFile}`);

try {
  execSync(`node ${path.join(__dirname, "run-migrations.js")} ${fullPath}`, {
    stdio: "inherit",
    env: process.env,
  });
  console.log(`Successfully applied migration: ${migrationFile}`);
} catch (error) {
  console.error(`Error applying migration ${migrationFile}: ${error.message}`);
  process.exit(1);
}
