import { initializeDatabase } from '../database';

export default defineNitroPlugin(async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});
