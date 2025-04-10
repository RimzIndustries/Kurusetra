#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Path to migrations directory
const migrationsDir = path.join(__dirname, "..", "supabase", "migrations");

// Check if the directory exists
if (!fs.existsSync(migrationsDir)) {
  console.error(`Migrations directory ${migrationsDir} does not exist`);
  process.exit(1);
}

// Get all migration files and sort them by name
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

if (migrationFiles.length === 0) {
  console.error("No migration files found");
  process.exit(1);
}

console.log(`Found ${migrationFiles.length} migration files`);

// Execute each migration file
for (const file of migrationFiles) {
  const migrationPath = path.join(migrationsDir, file);
  console.log(`Applying migration: ${file}`);

  try {
    execSync(
      `node ${path.join(__dirname, "run-migrations.js")} ${migrationPath}`,
      {
        stdio: "inherit",
        env: process.env,
      },
    );
    console.log(`Successfully applied migration: ${file}`);
  } catch (error) {
    console.error(`Error applying migration ${file}: ${error.message}`);
    process.exit(1);
  }
}

console.log("All migrations applied successfully");
