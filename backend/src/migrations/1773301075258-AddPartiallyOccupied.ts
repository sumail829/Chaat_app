import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPartiallyOccupied1773301075258 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TYPE table_status_enum 
    ADD VALUE IF NOT EXISTS 'partially_occupied'
  `);
}
public async down(queryRunner: QueryRunner): Promise<void> {
  // postgres doesn't support removing enum values
}

}
