import { ApiProperty } from '@nestjs/swagger';

export class AppendParticipantDto {
  @ApiProperty({
    description: '게임에 추가할 참여자의 핸들',
    default: 'm4ushold',
  })
  handle: string;

  @ApiProperty({
    description: '게임에 추가할 참여자의 목표 점수',
    default: 100,
  })
  goal: number;

  @ApiProperty({
    description: '게임에 추가할 참여자의 제외할 문제들의 id 목록',
    default: [1000, 1001],
  })
  excludeProblems: number[];
}
