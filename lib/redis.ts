import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;

export function isRedisConfigured(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}

export function getRedisClient(): Redis | null {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!redisInstance) {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL!;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN!;
    redisInstance = new Redis({
      url,
      token,
    });
  }

  return redisInstance;
}

export const REDIS_KEYS = {
  PROJECTS: 'chrispop:projects',
  CATEGORIES: 'chrispop:categories',
  POSTS: 'chrispop:posts',
} as const;

