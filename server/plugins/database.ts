import { initializeDatabase } from '../database/data-source';

export default defineNitroPlugin(async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});
