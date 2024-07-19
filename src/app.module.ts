import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders } from './database/database.service';
import { UsersModule } from './users/user.module';
import { NotificationModule } from './notification/notification.module';
import { Passport } from './middleware/passport';
import { ShipmentModule } from './shipment/shipment.module';

@Module({
  imports: [...databaseProviders, UsersModule, NotificationModule, ShipmentModule],
  controllers: [AppController],
  providers: [AppService, Passport],
  exports: [Passport]
})
export class AppModule {}
