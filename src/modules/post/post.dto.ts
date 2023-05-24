import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    default: 'Nike Invincible 3',
    type: 'string',
    name: 'title',
  })
  title;

  @IsNotEmpty()
  @MinLength(100)
  @MaxLength(2000)
  @IsString()
  @ApiProperty({
    name: 'description',
    default:
      'With maximum cushioning to support every mile, the Invincible 3 gives you our highest level of comfort underfoot to help you stay on your feet today, tomorrow and beyond. Designed to help keep you on feeling ready and reinvigorated',
    type: 'string',
  })
  description;

  @IsEnum(PostStatus)
  @ApiProperty({
    default: 'active',
    name: 'status',
    type: 'string',
  })
  status;
}

export class IdDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'id',
    default: 1,
    type: 'string',
  })
  id;
}
