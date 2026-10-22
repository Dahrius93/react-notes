import { request } from '@/shared/api/http'
import { API_URL } from '@/shared/api/jsonplaceholder/config'
import { sleep } from '@/shared/lib/sleep'

export type Coupon = { code: string; percent: number }

// Pretend these live on the server
const COUPONS: Record<string, number> = { REACT10: 10, VITEST20: 20 }

/**
 * Asks the "server" whether a discount code is valid.
 * A real network call (JSONPlaceholder as a stand-in) + a delay: in the
 * component tests this whole module is replaced with vi.mock.
 */
export async function validateCoupon(rawCode: string): Promise<Coupon> {
  const code = rawCode.trim().toUpperCase()
  await sleep(600)
  await request(`${API_URL}/posts/1`)
  const percent = COUPONS[code]
  if (!percent) throw new Error(`Il codice “${code}” non è valido`)
  return { code, percent }
}
