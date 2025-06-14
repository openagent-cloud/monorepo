import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export enum MutationType {
  INSERT = 'insert',
  UPDATE = 'update',
  REMOVE = 'remove',
}

export class MutationDto {
  @IsEnum(MutationType)
  @IsNotEmpty()
  type: MutationType;

  @IsString()
  @IsNotEmpty()
  collection: string;

  @IsString()
  @IsOptional()
  key?: string;

  @IsObject()
  @IsOptional()
  value?: Record<string, any>;
}
