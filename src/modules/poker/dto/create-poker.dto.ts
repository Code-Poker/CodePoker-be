import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsMongoId } from 'class-validator';

export class CreatePokerDto {
  @IsMongoId()
  @ApiProperty({
    description: '그룹 ID',
    example: '661819f47d985318e9aebc39',
  })
  groupId: string;

  @ApiProperty({
    description: '포커 이름',
    default: 'SCCC 포커',
  })
  name: string;

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
    description: '결과 정산 날짜',
    default: new Date(),
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: Date;
}
