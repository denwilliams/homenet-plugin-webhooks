import {IPluginLoader, ILogger, IConfig, IEventBus, ICommandManager} from '@homenet/core';
import * as express from 'express';

interface IWebhookConfig extends IConfig {
  webhooks: {
    port: number;
    hooks: any[];
    tokens: string[];
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
        app.post(`/hook/:token/${hook.id}`, (req, res) => {
          const token = req.params.token;
          if (this.config.webhooks.tokens.indexOf(token) < 0) {
            res.status(401).send();
            return;
          }
          this.commands.run(hook.target, hook.command, hook.args);
          res.status(200).send();
        });
      });
      app.listen(this.config.webhooks.port);
    }
  }

  return { WebhookPluginLoader };
}
