/** Every fragment of a remote removal repairs its own traversal span, including across concurrent surviving content. */
import { it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { check_history } from '../../../.helpers/history.ts'
import { histories } from '../../../.helpers/histories.ts'
it('Every fragment of a remote removal repairs its own traversal span, including across concurrent surviving content.', () =>
  check_history(Projection, histories[2]))
