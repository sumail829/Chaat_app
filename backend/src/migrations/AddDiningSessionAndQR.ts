import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDiningSessionAndQR1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add qrCode column to restaurant_tables
    await queryRunner.query(`
      ALTER TABLE restaurant_tables
      ADD COLUMN IF NOT EXISTS "qrCode" varchar NULL
    `);

    // Add sessionToken to orders
    await queryRunner.query(`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS "sessionToken" varchar NULL
    `);

    // Create session status enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE session_status_enum AS ENUM ('active', 'closed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `);

    // Create dining_sessions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS dining_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tableId" uuid NOT NULL REFERENCES restaurant_tables(id),
        "sessionToken" varchar NOT NULL UNIQUE,
        status session_status_enum NOT NULL DEFAULT 'active',
        "customerPhone" varchar NULL,
        "startTime" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "endTime" TIMESTAMP NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS dining_sessions`);
    await queryRunner.query(`DROP TYPE IF EXISTS session_status_enum`);
    await queryRunner.query(`ALTER TABLE orders DROP COLUMN IF EXISTS "sessionToken"`);
    await queryRunner.query(`ALTER TABLE restaurant_tables DROP COLUMN IF EXISTS "qrCode"`);
  }
}