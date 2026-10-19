/** A child anchored to the authored end of an overlapping mask remains replayable when only part of that mask consumes Frames. */
import { it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import { check_history } from '../../../.helpers/history.ts'
import { histories } from '../../../.helpers/histories.ts'
it('A child anchored to the authored end of an overlapping mask remains replayable when only part of that mask consumes Frames.', () =>
  check_history(Projection, histories[3]))
