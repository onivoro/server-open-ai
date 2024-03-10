import { Module } from "@nestjs/common";
import { moduleFactory } from "@onivoro/server-common";
import OpenAIApi from "openai";
import { ServerOpenAiConfig } from "./classes/server-open-ai-config.class";
import { OpenAiService } from "./services/open-ai.service";

@Module({})
export class ServerOpenAiModule {
  static configure(config: ServerOpenAiConfig) {
    const { apiKey, organization } = config;
    return moduleFactory({
      module: ServerOpenAiModule,
      providers: [
        OpenAiService,
        {
          provide: ServerOpenAiConfig,
          useValue: config
        },
        {
          provide: OpenAIApi,
          useFactory: () => new OpenAIApi(organization ? { apiKey, organization } : { apiKey }),
        },
      ],
      imports: [],
    });
  }
}
