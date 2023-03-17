import { Injectable } from '@nestjs/common';
import { IConfig } from 'config';

@Injectable()
export class ConfigService {
    config: IConfig
    getConfig(configKey: string){
        return this.config.get(configKey);
    }
}
