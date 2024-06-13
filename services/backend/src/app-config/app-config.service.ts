import { Injectable } from '@nestjs/common';

export class AppConfig {
  dummyApi: boolean;
  openAiKey: string;
  tavilyApiKey: string;

  static default() {
    const ret = new AppConfig();
    ret.dummyApi = true;
    return ret;
  }
}

@Injectable()
export class AppConfigService {
  private appConfig: AppConfig = AppConfig.default();

  public getConfig() {
    return this.appConfig;
  }

  public setConfig(config: AppConfig) {
    this.appConfig = config;
  }
}
