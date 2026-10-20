/** Local insertion after a competing subtree updates the enclosing jump before indexed reads. */
import { it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { check_history } from '../../../.helpers/history.ts'
import { histories } from '../../../.helpers/histories.ts'
it('Local insertion after a competing subtree updates the enclosing jump before indexed reads.', () =>
  check_history(Projection, histories[1]))
