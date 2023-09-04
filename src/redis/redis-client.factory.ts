import { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisClient, REDIS_CLIENT } from './redis-client.types';
export const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    try {
      const client = createClient({
        url: 'redis://default:bhX2Yz9AXR1zDQeCVvvv2CCgipL0aTAS@redis-19176.c293.eu-central-1-1.ec2.cloud.redislabs.com:19176',
      });
      await client.connect();
      return client;
    } catch (err) {
      console.log(err);
    }
  },
};
