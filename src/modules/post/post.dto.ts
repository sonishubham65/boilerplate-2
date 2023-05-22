import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsObject,
  ValidateNested,
  IsBoolean,
  IsOptional,
  isString,
  IsNumberString,
} from 'class-validator';
import { PostStatus } from './post.model';

export class PostDTO {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  title;

  @IsNotEmpty()
  @MinLength(100)
  @MaxLength(2000)
  @IsString()
  description;

  @IsEnum(PostStatus)
  status;
}


export class IdDTO {
  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  id;
}
