import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    description: 'Name of the group',
    example: 'Group 1',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the group',
    example: 'This is a group',
  })
  description: string;
}
