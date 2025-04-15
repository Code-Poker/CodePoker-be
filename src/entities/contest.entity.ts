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
    startTime: Date,
    endTime: Date,
    badge?: string,
    background?: string,
  ) {
    this.venue = venue;
    this.name = name;
    this.url = url;
    this.startTime = startTime.toISOString();
    this.endTime = endTime.toISOString();
    this.badge = badge;
    this.background = background;
  }

  static fromCList(data: { event: string; start: string; end: string; href: string; resource_id: number }) {
    return new Contest(
      clistMap[data.resource_id] ?? 'Unknown',
      data.event,
      data.href,
      new Date(data.start + '.000Z'),
      new Date(data.end + '.000Z'),
    );
  }
}

const clistMap: Record<number, string> = {
  1: 'Codeforces',
  25: 'USACO',
  86: 'ICPC',
  141: 'ICPC',
  93: 'AtCoder',
  102: 'LeetCode',
};

export class ContestList {
  ended: Contest[] = [];
  ongoing: Contest[] = [];
  upcoming: Contest[] = [];
}
