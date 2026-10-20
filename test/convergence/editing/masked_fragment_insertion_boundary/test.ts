/** A replacement at a surviving fragment boundary stays at the requested visible position on both live peers. */
import { it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { check_history } from '../../../.helpers/history.ts'
import { histories } from '../../../.helpers/histories.ts'
it('A replacement at a surviving fragment boundary stays at the requested visible position on both live peers.', () =>
  check_history(Projection, histories[0]))
