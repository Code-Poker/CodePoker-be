import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OauthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  callback(
    code: string,
    state: string,
    error: string,
    error_description: string,
  ) {
    return { code, state, error, error_description };
  }

  async getToken(code: string) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: this.configService.get<string>('KAKAO_REST_API_KEY'),
          redirect_uri: this.configService.get<string>('KAKAO_REDIRECT_URI'),
          code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      ),
    );

    return data;
  }
}
