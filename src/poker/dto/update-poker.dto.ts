import { PartialType } from '@nestjs/swagger';
import { CreatePokerDto } from './create-poker.dto';

export class UpdatePokerDto extends PartialType(CreatePokerDto) {}
