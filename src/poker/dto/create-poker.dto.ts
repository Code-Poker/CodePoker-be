import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreatePokerDto {
  @IsMongoId()
  @ApiProperty({
    description: '그룹 ID',
    example: '66102e3152abeb7ea1ca7a78',
  })
  groupId: string;

  @ApiProperty({
    description: '게임에 참여하는 사람들의 목록',
    default: [
      {
        handle: 'w8385',
        goal: 8385,
      },
      {
        handle: 'm4ushold',
        goal: 925,
      },
    ],
  })
  participants: {
    handle: string;
    goal: number;
  }[];

  @ApiProperty({
    required: false,
    description: '과제 목록',
    default: [],
  })
  tasks: number[];

  @ApiProperty({
    description: '결과 정산 날짜',
    default: new Date(),
  })
  endDate: Date;
}
