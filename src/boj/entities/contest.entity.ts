import { ApiProperty } from '@nestjs/swagger';

export class Contest {
  @ApiProperty({ example: 'BOJ Open', description: '사이트 이름' })
  venue: string;

  @ApiProperty({ example: '2024 SCON Open Contest', description: '대회 이름' })
  name: string;

  @ApiProperty({
    example: 'https://www.acmicpc.net/contest/view/1264',
    description: '대회 링크',
  })
  url: string;

  @ApiProperty({
    example: new Date('2024-05-04 14:00:00 GMT+0900'),
    description: '대회 시작 날짜',
  })
  startDate: string;

  @ApiProperty({
    example: new Date('2024-05-04 16:30:00 GMT+0900'),
    description: '대회 종료 날짜',
  })
  endDate: string;
}

export class ContestList {
  endedContests: Contest[];
  ongoingContests: Contest[];
  upcomingContests: Contest[];
}