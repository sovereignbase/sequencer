import { Projection } from '../../dist/index.js'
const state = new Projection(1)
let frames = 0
for (let i = 0; i < 10000; i++) {
  const count = 1 + (i % 100)
  state.insert(new Array(count).fill(i), frames)
  frames += count
}
const sequence = state.sequence()
for (let i = 0; i < 160; i++) {
  const restored = new Projection(2, sequence)
  restored.destroy()
}
for (let i = 0; i < 96; i++) state.values()
for (let i = 0; i < 96; i++) state.sequence()
for (let i = 0; i < 100000; i++)
  state.value((Math.imul(i, 48271) >>> 0) % frames)
state.destroy()
