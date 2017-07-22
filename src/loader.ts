import {IPluginLoader, ILogger, IConfig, IEventBus, IStatsTarget} from '@homenet/core';

interface IWebhookConfig extends IConfig {
  webhooks: any
}

export function create(annotate: any): { WebhookPluginLoader: new(...args: any[]) => IPluginLoader } {
  @annotate.plugin()
  class WebhookPluginLoader {
    constructor(
      @annotate.service('IConfig') private config: IWebhookConfig,
      @annotate.service('ILogger') private logger: ILogger,
      @annotate.service('IEventBus') private eventBus: IEventBus
    ) {
    }

    load() : void {
      this.logger.info('Loading webhooks');

      // TODO: start express
    }
  }

  return { WebhookPluginLoader };
}
