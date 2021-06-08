const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class activeEvents1623140131852 {
    name = 'activeEvents1623140131852'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event" ADD "active" bit NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "active"`);
    }
}
