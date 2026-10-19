/** Bounded and indexed reads agree with bulk values after live replacements and restarts. */
import { it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { check_history } from '../../../.helpers/history.ts'
import { histories } from '../../../.helpers/histories.ts'
it('Bounded and indexed reads agree with bulk values after live replacements and restarts.', () =>
  check_history(Projection, histories[4]))
