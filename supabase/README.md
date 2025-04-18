# Game Text - Supabase Migration Guide

This guide will help you set up and migrate the database to Supabase.

## Prerequisites

1. Node.js and npm installed
2. Supabase CLI installed
3. Supabase project created
4. Database credentials

## Setup

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Configure environment variables in `config.toml`:
- Update project_id
- Update API URL and keys
- Update database credentials

3. Make the migration script executable:
```bash
chmod +x migrate.sh
```

## Running Migrations

1. Login to Supabase:
```bash
supabase login
```

2. Link your project:
```bash
supabase link --project-ref your-project-ref
```

3. Run migrations:
```bash
./migrate.sh
```

## Migration Order

The migrations will run in the following order:

1. Create base tables
2. Enhance game systems
3. Add PvP system
4. Add alliance system
5. Add war system
6. Update user profiles
7. Optimize performance

## Verification

After migration, verify:
1. All tables are created
2. RLS policies are enabled
3. Functions are working
4. Triggers are active

## Troubleshooting

If you encounter issues:

1. Check migration logs
2. Verify database connection
3. Check RLS policies
4. Verify function permissions

## Support

For support, please contact the development team. 