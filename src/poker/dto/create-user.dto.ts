import { ApiProperty } from '@nestjs/swagger';

export class CreatePokerDto {
  @ApiProperty({
    description: '게임에 참여하는 사람들의 핸들 목록과 목표 점수',
    default: {
      m4ushold: 250,
      rkaskan506: 180,
      w8385: 180,
      eric2057: 340,
      qwerty1120: 105,
      lur100: 225,
    },
  })
  participants: { [key: string]: number };
}
