import { MigrationInterface, QueryRunner, Table, Index, TableForeignKey } from "typeorm";

export class InitialMigration1640000000001 implements MigrationInterface {
    name = 'InitialMigration1640000000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension for PostgreSQL
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create users table
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "googleId",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "avatar",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        // Create pages table
        await queryRunner.createTable(
            new Table({
                name: "pages",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "slug",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "500",
                    },
                    {
                        name: "excerpt",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "content",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "pageJson",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "featuredImage",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "seoTitle",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "seoDescription",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "seoKeywords",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                    },
                    {
                        name: "schema",
                        type: "jsonb",
                        isNullable: true,
                    },
                    {
                        name: "isPublished",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "authorId",
                        type: "uuid",
                    },
                ],
            }),
            true
        );

        // Create foreign key relationship
        await queryRunner.createForeignKey(
            "pages",
            new TableForeignKey({
                columnNames: ["authorId"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // Create indexes using SQL for better compatibility
        await queryRunner.query(`CREATE INDEX "IDX_USER_GOOGLE_ID" ON "users" ("googleId")`);
        await queryRunner.query(`CREATE INDEX "IDX_USER_EMAIL" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_PAGE_SLUG" ON "pages" ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_PAGE_AUTHOR_ID" ON "pages" ("authorId")`);
        await queryRunner.query(`CREATE INDEX "IDX_PAGE_PUBLISHED" ON "pages" ("isPublished")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("pages");
        await queryRunner.dropTable("users");
    }
}
