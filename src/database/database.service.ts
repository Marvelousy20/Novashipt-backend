import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const uri = configService.get<string>('MONGODB_URI');
      try {
        await mongoose.connect(uri);
        console.log('Database connected successfully');
        return { uri };
      } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
      }
    },
    inject: [ConfigService],
  }),
];