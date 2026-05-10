import { EntitySchema } from 'typeorm';
import type { User } from './User';

/**
 * Page interface for TypeScript type safety.
 * Used throughout the app for typing page objects.
 */
export interface Page {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  pageJson: any;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  schema: any;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  authorId: string;
}

/**
 * Page entity schema — defines the 'pages' table.
 * Uses EntitySchema instead of decorators for compatibility with esbuild/Vite bundlers.
 */
export const PageEntity = new EntitySchema<Page>({
  name: 'Page',
  tableName: 'pages',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    slug: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
    },
    excerpt: {
      type: String,
      nullable: true,
    },
    pageJson: {
      type: 'jsonb',
      nullable: true,
    },
    featuredImage: {
      type: String,
      nullable: true,
    },
    seoTitle: {
      type: String,
      nullable: true,
    },
    seoDescription: {
      type: String,
      nullable: true,
    },
    seoKeywords: {
      type: String,
      nullable: true,
    },
    schema: {
      type: 'jsonb',
      nullable: true,
    },
    isPublished: {
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
    authorId: {
      type: 'uuid',
    },
  },
  relations: {
    author: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'pages',
      joinColumn: { name: 'authorId' },
    },
  },
});
