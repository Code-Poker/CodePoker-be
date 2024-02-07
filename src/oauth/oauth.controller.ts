import { Controller, Get, Post, Query } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('OAuth')
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @ApiExcludeEndpoint()
  @Get()
  callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') error_description: string,
  ) {
    return this.oauthService.callback(code, state, error, error_description);
  }

  @Post('token')
  getToken(@Query('code') code: string) {
    return this.oauthService.getToken(code);
  }
}
