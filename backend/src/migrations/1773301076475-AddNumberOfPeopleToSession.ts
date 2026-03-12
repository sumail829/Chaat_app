import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNumberOfPeopleToSession1773301076475 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE dining_sessions 
    ADD COLUMN IF NOT EXISTS "numberOfPeople" int NOT NULL DEFAULT 1
  `);
}
public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE dining_sessions 
    DROP COLUMN IF EXISTS "numberOfPeople"
  `);
}

}
