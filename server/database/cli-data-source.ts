/**
 * CLI-only data source for TypeORM migration commands.
 * Run with: npx tsx node_modules/typeorm/cli.js -d server/database/cli-data-source.ts
 *
 * This file loads .env manually since the CLI runs outside of Nuxt.
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/User';
import { PageEntity } from './entities/Page';

const CliDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '1234',
  database: process.env.DATABASE_NAME || 'pagebuilder',
  synchronize: false, // Never auto-sync in CLI — use migrations instead
  logging: true,
  entities: [UserEntity, PageEntity],
  migrations: ['server/database/migrations/*.ts'],
});

export default CliDataSource;
