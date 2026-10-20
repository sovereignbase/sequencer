/** A valid local removal remains addressable after alternating live replacements, mask fragmentation and restarts. */
import { it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { check_history } from '../../../.helpers/history.ts'
import { histories } from '../../../.helpers/histories.ts'
it('A valid local removal remains addressable after alternating live replacements, mask fragmentation and restarts.', () =>
  check_history(Projection, histories[7]))
