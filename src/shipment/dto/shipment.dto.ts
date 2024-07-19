import { IsString, IsNotEmpty, IsEmail, IsObject, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShipmentDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    enterpriseId: string;

    @IsString()
    @IsNotEmpty()
    weight: string;
    
    @IsString()
    @IsOptional()
    service: string;

    @IsString()
    @IsOptional()
    category: string;

    @IsString()
    @IsNotEmpty()
    deliveryDate: string;

    @IsString()
    @IsNotEmpty()
    deliveryTimeRange: string;
}

export class UpdateShipmentLocation {
    @IsString()
    @IsNotEmpty()
    longitude: string;

    @IsString()
    @IsNotEmpty()
    latitude: string;
}

export class UpdateShipmentProgress {
    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    location: string;
}

export class UpdateShipmentStatus {
    @IsString()
    @IsNotEmpty()
    status: string;
}

