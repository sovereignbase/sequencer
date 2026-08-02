import * as sequencer from '/dist/index.js'

self.addEventListener('message', () => {
  try {
    const state = sequencer.__create()
    const result = sequencer.__update(
      state,
      0,
      ['worker-alpha', 'worker-beta'],
      'after'
    )
    self.postMessage({
      accepted: result !== false,
      length: sequencer.__length(state),
      values: [sequencer.__read(state, 0), sequencer.__read(state, 1)],
    })
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : String(error),
    })
  }
})
