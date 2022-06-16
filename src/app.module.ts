import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./health/health.module";

import { CatsModule } from "./cats/cats.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    CatsModule,
    MongooseModule.forRoot("mongodb://localhost/test"),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}