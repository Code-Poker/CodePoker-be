import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function SolvedSearchQuery() {
  return applyDecorators(ApiQuery({}), ApiQuery({}), ApiQuery({}));
}
