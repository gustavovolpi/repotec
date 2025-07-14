import { IsString, Length } from 'class-validator';

export class CriarTagDto {
  @IsString()
  @Length(1, 50)
  nome: string;
} 