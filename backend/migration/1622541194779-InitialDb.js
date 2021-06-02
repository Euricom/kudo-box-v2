const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitialDb1622541194779 {
    name = 'InitialDb1622541194779'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_cace4a159ff9f2512dd42373760" DEFAULT NEWSEQUENTIALID(), "firstname" nvarchar(255) NOT NULL, "lastname" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kudo" ("imageUrl" nvarchar(255), "id" uniqueidentifier NOT NULL CONSTRAINT "DF_0118aa20696dc49c1342eca687c" DEFAULT NEWSEQUENTIALID(), "sendDateTime" datetime NOT NULL, "eventId" uniqueidentifier, "senderId" uniqueidentifier, "receiverId" uniqueidentifier, CONSTRAINT "PK_0118aa20696dc49c1342eca687c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_8e4052373c579afc1471f526760" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255), "ownerEventId" uniqueidentifier, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_891124a7c0fbc86daa17dd6b62" ON "tag" ("ownerEventId") WHERE "ownerEventId" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "event" ("imageUrl" nvarchar(255), "id" uniqueidentifier NOT NULL CONSTRAINT "DF_30c2f3bbaf6d34a55f8ae6e4614" DEFAULT NEWSEQUENTIALID(), "title" nvarchar(255) NOT NULL, "isMainEvent" bit NOT NULL, "creationDate" datetime NOT NULL, "hostId" uniqueidentifier, "mainEventId" uniqueidentifier, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_tag" ("eventId" uniqueidentifier NOT NULL, "tagId" uniqueidentifier NOT NULL, CONSTRAINT "PK_0161454826f7fce5f1f5687cacc" PRIMARY KEY ("eventId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cc342f8adbe5daf1bdee9a8e65" ON "event_tag" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a00dfb2187e99b1257450cb16a" ON "event_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "kudo" ADD CONSTRAINT "FK_302d3d2522fe89e33a98dbaa340" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kudo" ADD CONSTRAINT "FK_bb79143bcd8e9b809826e6c5637" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kudo" ADD CONSTRAINT "FK_fd1ca67cabcc9a44ffd4c0c016a" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_891124a7c0fbc86daa17dd6b62e" FOREIGN KEY ("ownerEventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_fb103c0ac614a2d39d6b62de6fd" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_d3b7e34d0aec56b7b70579db5d1" FOREIGN KEY ("mainEventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_tag" ADD CONSTRAINT "FK_cc342f8adbe5daf1bdee9a8e651" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_tag" ADD CONSTRAINT "FK_a00dfb2187e99b1257450cb16ad" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event_tag" DROP CONSTRAINT "FK_a00dfb2187e99b1257450cb16ad"`);
        await queryRunner.query(`ALTER TABLE "event_tag" DROP CONSTRAINT "FK_cc342f8adbe5daf1bdee9a8e651"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_d3b7e34d0aec56b7b70579db5d1"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_fb103c0ac614a2d39d6b62de6fd"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_891124a7c0fbc86daa17dd6b62e"`);
        await queryRunner.query(`ALTER TABLE "kudo" DROP CONSTRAINT "FK_fd1ca67cabcc9a44ffd4c0c016a"`);
        await queryRunner.query(`ALTER TABLE "kudo" DROP CONSTRAINT "FK_bb79143bcd8e9b809826e6c5637"`);
        await queryRunner.query(`ALTER TABLE "kudo" DROP CONSTRAINT "FK_302d3d2522fe89e33a98dbaa340"`);
        await queryRunner.query(`DROP INDEX "IDX_a00dfb2187e99b1257450cb16a" ON "event_tag"`);
        await queryRunner.query(`DROP INDEX "IDX_cc342f8adbe5daf1bdee9a8e65" ON "event_tag"`);
        await queryRunner.query(`DROP TABLE "event_tag"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP INDEX "REL_891124a7c0fbc86daa17dd6b62" ON "tag"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "kudo"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
