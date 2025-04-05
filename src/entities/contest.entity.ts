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
  startTime: string;

  @ApiProperty({
    example: new Date('2024-05-04 16:30:00 GMT+0900'),
    description: '대회 종료 날짜',
  })
  endTime: string;

  @ApiProperty({
    example: '1문제 이상 해결',
    description: '뱃지 획득 조건',
  })
  badge: string | undefined;

  @ApiProperty({
    example: '1문제 이상 해결',
    description: '배경 획득 조건',
  })
  background: string | undefined;

  constructor(
    venue: string,
    name: string,
    url: string,
    startTime: string,
    endTime: string,
    badge?: string,
    background?: string,
  ) {
    this.venue = venue;
    this.name = name;
    this.url = url;
    this.startTime = startTime;
    this.endTime = endTime;
    this.badge = badge;
    this.background = background;
  }
}

export class ContestList {
  ended: Contest[];
  ongoing: Contest[];
  upcoming: Contest[];
}
