/** Hydration indexes the completed Structural Order when later masks revisit a previously visible prefix. */
import { it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { check_history } from '../../../.helpers/history.ts'
import { histories } from '../../../.helpers/histories.ts'
it('Hydration indexes the completed Structural Order when later masks revisit a previously visible prefix.', () =>
  check_history(Projection, histories[5]))
