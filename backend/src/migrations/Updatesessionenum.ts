import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSessionEnum1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE session_status_enum ADD VALUE IF NOT EXISTS 'pending';
    `);
    await queryRunner.query(`
      ALTER TYPE session_status_enum ADD VALUE IF NOT EXISTS 'expired';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Postgres doesn't support removing enum values easily
    // Would need to recreate the type
  }
}