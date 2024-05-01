import { remote } from 'webdriverio';

export const webdriverProvider = {
  provide: 'WEBDRIVER',
  useFactory: async () => {
    return remote({
      capabilities: {
        browserName: 'chrome',
      },
    });
  },
};
