/**
 * Signing pings to the CEO Telegram bot, the same one packages/feedback,
 * packages/lov and foothill-inbox use in the ceo repo.
 *
 * The token is a secret (WEB_TELEGRAM_BOT_TOKEN, per-service prefix so revoking
 * one service does not silence the others). The chat id is a plain var: an
 * address is not a credential.
 */

export interface TelegramEnv {
  WEB_TELEGRAM_BOT_TOKEN?: string
  TELEGRAM_CHAT_ID?: string
}

/**
 * Injected rather than reached for, so a caller can assert the payload without
 * patching globalThis.fetch and without a network call ever being possible.
 */
export type TelegramSender = (env: TelegramEnv, text: string) => Promise<boolean>

/**
 * Returns false rather than throwing, on a missing binding or any non-2xx.
 * This is load-bearing: the ping fires AFTER the signature has already committed
 * to D1, so a Telegram outage must never turn a recorded signature into an error
 * the client sees. Losing the notification is recoverable; losing the signature
 * is not.
 */
export const sendTelegram: TelegramSender = async (env, text) => {
  if (!env.WEB_TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    console.log('[ping] telegram not configured, skipping:', text)
    return false
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${env.WEB_TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          disable_web_page_preview: true,
        }),
      },
    )
    if (!res.ok) {
      console.log(`[ping] telegram send failed: ${res.status} ${await res.text()}`)
      return false
    }
    return true
  } catch (err) {
    console.log('[ping] telegram send threw', err)
    return false
  }
}
