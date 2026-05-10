import { DataSource } from 'typeorm';
import { UserEntity } from './entities/User';
import { PageEntity } from './entities/Page';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '1234',
  database: process.env.DATABASE_NAME || 'pagebuilder',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [UserEntity, PageEntity],
  migrations: ['server/database/migrations/*.{ts,js}'],
});

let dataSource: DataSource | null = null;

export async function initializeDatabase() {
  if (!dataSource) {
    dataSource = AppDataSource;
    await dataSource.initialize();
    console.log('Database connection established successfully');
  }
  return dataSource;
}

export function getDataSource() {
  if (!dataSource) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dataSource;
}
