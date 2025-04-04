import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProblemService } from './service';

@ApiTags('Problem')
@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  // @Get(':problemId/refresh')
  // async refresh(@Param('problemId') problemId: string) {
  //   return this.problemService.refresh(problemId);
  // }
}
