import * as sequencer from '/dist/index.js'

self.addEventListener('message', () => {
  try {
    const state = sequencer.create()
    const result = sequencer.insert(state, 0, ['worker-alpha', 'worker-beta'])
    self.postMessage({
      accepted: result !== false,
      length: sequencer.length(state),
      values: sequencer.values(state),
    })
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : String(error),
    })
  }
})
