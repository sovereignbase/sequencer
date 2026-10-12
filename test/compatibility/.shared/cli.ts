/** Portable process entry: stdout carries outcomes for the Node compatibility harness. */
import { runSuite } from './suite.ts'

console.log(JSON.stringify(runSuite()))
