import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrentOccupancy1773300601972 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE restaurant_tables 
    ADD COLUMN IF NOT EXISTS "currentOccupancy" int NOT NULL DEFAULT 0
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE restaurant_tables 
    DROP COLUMN IF EXISTS "currentOccupancy"
  `);
}

}
