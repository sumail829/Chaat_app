import { IsString } from 'class-validator';

export class EndSessionDto {
  @IsString()
  sessionToken: string;
}