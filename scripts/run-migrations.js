#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Get the migration file from command line arguments
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error("Please provide a migration file path");
  process.exit(1);
}

// Check if the file exists
if (!fs.existsSync(migrationFile)) {
  console.error(`Migration file ${migrationFile} does not exist`);
  process.exit(1);
}

// Read the SQL content
const sqlContent = fs.readFileSync(migrationFile, "utf8");

// Get Supabase credentials from environment variables
// Try multiple possible environment variable names
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials not found in environment variables");
  console.error(
    "Make sure one of these is set: VITE_SUPABASE_URL/SUPABASE_URL and SUPABASE_SERVICE_KEY/SUPABASE_KEY/SUPABASE_ANON_KEY",
  );
  console.log(
    "Available environment variables:",
    Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
  );
  process.exit(1);
}

// Create a temporary file with the SQL content
const tempFile = path.join(__dirname, "temp-migration.sql");
fs.writeFileSync(tempFile, sqlContent);

try {
  // Execute the SQL using curl and the Supabase REST API
  // Escape SQL content properly for shell command
  const escapedSql = sqlContent
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ")
    .replace(/'/g, "'\\''")
    .replace(/\$/g, "\\$");

  const command = `curl -X POST '${supabaseUrl}/rest/v1/rpc/exec_sql' \
    -H 'apikey: ${supabaseKey}' \
    -H 'Authorization: Bearer ${supabaseKey}' \
    -H 'Content-Type: application/json' \
    -d '{"query": "${escapedSql}"}'`;

  console.log("Executing migration...");
  execSync(command, { stdio: "inherit" });
  console.log(`Migration ${migrationFile} executed successfully`);
} catch (error) {
  console.error(`Error executing migration: ${error.message}`);
  process.exit(1);
} finally {
  // Clean up the temporary file
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}
