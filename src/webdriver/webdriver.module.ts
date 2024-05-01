import { Module } from '@nestjs/common';

import { webdriverProvider } from './webdriver.provider';

@Module({
  providers: [webdriverProvider],
  exports: [webdriverProvider],
})
export class WebdriverModule {}
