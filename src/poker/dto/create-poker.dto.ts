import { ApiProperty } from '@nestjs/swagger';

export class CreatePokerDto {
  @ApiProperty({
    description: '게임에 참여하는 사람들의 핸들 목록',
    default: [
      'effectus60',
      'mseo2004',
      'jmin2649',
      'tgkim12',
      'hongki13',
      'ehdals110',
      'sjyshos12',
      'philbae',
      'onekyul02',
      'yooonman',
      'ssssssss2345',
      'mannie',
      'saripi',
      'cj8hu9',
      '0608hsh',
    ],
  })
  participants: string[];

  @ApiProperty({
    description: '과제 목록',
    default: [
      1000, 1001, 1008, 1330, 2420, 2438, 2475, 2557, 2738, 2739, 2741, 2743,
      2744, 2753, 2754, 5597, 7287, 9086, 9498, 10171, 10172, 10699, 10807,
      10869, 10871, 10872, 10950, 10951, 10952, 10998, 11382, 11654, 11718,
      14681, 15552, 15964, 25083, 27866,
    ],
  })
  tasks: number[];
}
