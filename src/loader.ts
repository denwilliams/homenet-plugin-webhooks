import {IPluginLoader, ILogger, IConfig, IEventBus, ICommandManager} from '@homenet/core';
import * as express from 'express';

interface IWebhookConfig extends IConfig {
  webhooks: {
    port: number;
    hooks: Array<any>;
  }
}

export function create(annotate: any): { WebhookPluginLoader: new(...args: any[]) => IPluginLoader } {
  @annotate.plugin()
  class WebhookPluginLoader {
    constructor(
      @annotate.service('IConfig') private config: IWebhookConfig,
      @annotate.service('ILogger') private logger: ILogger,
      @annotate.service('ICommandManager') private commands: ICommandManager,
      @annotate.service('IEventBus') private eventBus: IEventBus
    ) {
    }

    load() : void {
      if (!this.config.webhooks) return;

      this.logger.info('Loading webhooks');

      const app = express();
      this.config.webhooks.hooks.forEach(hook => {
        app.post(hook.id, (req, res) => {
          this.commands.run(hook.target, hook.command, hook.args);
        });
      });
      app.listen(this.config.webhooks.port);
    }
  }

  return { WebhookPluginLoader };
}
