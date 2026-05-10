import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  excerpt: string;

  @Column({ type: 'jsonb', nullable: true })
  pageJson: any;

  @Column({ nullable: true })
  featuredImage: string;

  @Column({ nullable: true })
  seoTitle: string;

  @Column({ nullable: true })
  seoDescription: string;

  @Column({ nullable: true })
  seoKeywords: string;

  @Column({ type: 'jsonb', nullable: true })
  schema: any;

  @Column({ default: true })
  isPublished: boolean;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.pages)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;
}
