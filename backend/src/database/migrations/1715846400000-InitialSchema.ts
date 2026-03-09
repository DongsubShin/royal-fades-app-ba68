import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1715846400000 implements MigrationInterface {
    name = 'InitialSchema1715846400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users Table
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'barber', 'client')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'client', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672df88af87152a3f12b964e2" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_email" ON "users" ("email") `);

        // Barbers Table
        await queryRunner.query(`CREATE TABLE "barbers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "specialties" text, "working_hours" jsonb, "is_active" boolean NOT NULL DEFAULT true, "default_commission_rate" numeric(5,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "REL_789456123" UNIQUE ("user_id"), CONSTRAINT "PK_barbers_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_barber_user_id" ON "barbers" ("user_id") `);

        // Clients Table
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone" character varying NOT NULL, "visit_count" integer NOT NULL DEFAULT 0, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "UQ_phone" UNIQUE ("phone"), CONSTRAINT "REL_client_user" UNIQUE ("user_id"), CONSTRAINT "PK_clients_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_client_user_id" ON "clients" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_client_phone" ON "clients" ("phone") `);

        // Services Table
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "duration" integer NOT NULL, "price" numeric(10,2) NOT NULL, "category" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_services_id" PRIMARY KEY ("id"))`);

        // Bookings Table
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending', "total_price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "barber_id" uuid, "client_id" uuid, CONSTRAINT "PK_bookings_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_booking_barber_id" ON "bookings" ("barber_id") `);
        await queryRunner.query(`CREATE INDEX "idx_booking_client_id" ON "bookings" ("client_id") `);
        await queryRunner.query(`CREATE INDEX "idx_booking_start_time" ON "bookings" ("start_time") `);
        await queryRunner.query(`CREATE INDEX "idx_booking_status" ON "bookings" ("status") `);

        // Booking Services Join Table
        await queryRunner.query(`CREATE TABLE "booking_services" ("booking_id" uuid NOT NULL, "service_id" uuid NOT NULL, CONSTRAINT "PK_booking_services" PRIMARY KEY ("booking_id", "service_id"))`);

        // Queue Entries Table
        await queryRunner.query(`CREATE TYPE "public"."queue_status_enum" AS ENUM('waiting', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "queue_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" integer NOT NULL, "status" "public"."queue_status_enum" NOT NULL DEFAULT 'waiting', "estimated_wait_minutes" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid, "barber_id" uuid, CONSTRAINT "PK_queue_entries_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_queue_status" ON "queue_entries" ("status") `);

        // Loyalty Cards Table
        await queryRunner.query(`CREATE TABLE "loyalty_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "points" integer NOT NULL DEFAULT 0, "tier" character varying NOT NULL DEFAULT 'Bronze', "rewards" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid, CONSTRAINT "REL_loyalty_client" UNIQUE ("client_id"), CONSTRAINT "PK_loyalty_cards_id" PRIMARY KEY ("id"))`);

        // Notifications Table
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('sms', 'email', 'push')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_status_enum" AS ENUM('scheduled', 'sent', 'failed')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."notifications_type_enum" NOT NULL, "message" text NOT NULL, "scheduled_at" TIMESTAMP NOT NULL, "sent_at" TIMESTAMP, "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'scheduled', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid, CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_notification_scheduled" ON "notifications" ("scheduled_at") `);

        // Commissions Table
        await queryRunner.query(`CREATE TABLE "commissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "rate" numeric(5,2) NOT NULL, "paid_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "barber_id" uuid, "booking_id" uuid, CONSTRAINT "REL_commission_booking" UNIQUE ("booking_id"), CONSTRAINT "PK_commissions_id" PRIMARY KEY ("id"))`);

        // Payments Table
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'succeeded', 'failed', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "stripe_id" character varying, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "payment_method" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "booking_id" uuid, CONSTRAINT "REL_payment_booking" UNIQUE ("booking_id"), CONSTRAINT "PK_payments_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_payment_stripe_id" ON "payments" ("stripe_id") `);

        // Foreign Keys
        await queryRunner.query(`ALTER TABLE "barbers" ADD CONSTRAINT "FK_barber_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_client_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_booking_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_booking_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_services" ADD CONSTRAINT "FK_booking_services_booking" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "booking_services" ADD CONSTRAINT "FK_booking_services_service" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loyalty_cards" ADD CONSTRAINT "FK_loyalty_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notification_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commissions" ADD CONSTRAINT "FK_commission_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commissions" ADD CONSTRAINT "FK_commission_booking" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_payment_booking" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "commissions"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "loyalty_cards"`);
        await queryRunner.query(`DROP TABLE "queue_entries"`);
        await queryRunner.query(`DROP TYPE "public"."queue_status_enum"`);
        await queryRunner.query(`DROP TABLE "booking_services"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "barbers"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}