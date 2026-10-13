import fs from 'fs';
import path from 'path';
import { DATA_DIR } from './config.js';

const WEBHOOKS_FILE = path.join(DATA_DIR, 'webhooks.json');
const ALL_PAYMENT_EVENTS = ['payment.success', 'payment.failed', 'payment.expired', 'payment.lost'];

const webhookFromEnv = () => {
  const url = process.env.WEBHOOK_URL?.trim();
  if (!url) return null;
  return {
    url,
    events: ALL_PAYMENT_EVENTS,
    secret: process.env.WEBHOOK_SECRET || '',
  };
};

/**
 * Читает webhooks.json и возвращает массив вебхуков.
 * При ошибке чтения/парсинга возвращает [].
 */
export const loadWebhooks = () => {
  const hooks = [];
  const envHook = webhookFromEnv();
  if (envHook) hooks.push(envHook);

  try {
    const raw = fs.readFileSync(WEBHOOKS_FILE, 'utf8');
    const fileHooks = JSON.parse(raw);
    if (Array.isArray(fileHooks)) hooks.push(...fileHooks);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('[WEBHOOK STORE] Error reading webhooks.json:', err.message);
    }
  }
  return hooks;
};

/**
 * Возвращает вебхуки, подписанные на указанное событие.
 */
export const getWebhooksByEvent = (event) => {
  return loadWebhooks().filter((hook) => hook.url && Array.isArray(hook.events) && hook.events.includes(event));
};
