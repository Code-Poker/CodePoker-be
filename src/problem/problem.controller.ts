import { Controller, Get, Param } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Problem')
@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get(':problemId/refresh')
  async refresh(@Param('problemId') problemId: string) {
    return this.problemService.refresh(problemId);
  }
}
