import { EntitySchema } from 'typeorm';
import type { Page } from './Page';

/**
 * User interface for TypeScript type safety.
 * Used throughout the app for typing user objects.
 */
export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  pages: Page[];
}

/**
 * User entity schema — defines the 'users' table.
 * Uses EntitySchema instead of decorators for compatibility with esbuild/Vite bundlers.
 */
export const UserEntity = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    googleId: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
      nullable: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    pages: {
      type: 'one-to-many',
      target: 'Page',
      inverseSide: 'author',
    },
  },
});