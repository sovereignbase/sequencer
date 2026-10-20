/** Reverse and duplicate delivery retains complete causal subtrees through local edits and snapshot hydration. */
import { it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { check_history } from '../../../.helpers/history.ts'
import { histories } from '../../../.helpers/histories.ts'
it('Reverse and duplicate delivery retains complete causal subtrees through local edits and snapshot hydration.', () =>
  check_history(Projection, histories[6]))
