import { pathToFileURL } from 'node:url';
import { serialize } from 'node:v8';
const memories=[];
const NativeInstance=WebAssembly.Instance;
WebAssembly.Instance=class extends NativeInstance {
  constructor(...args) {
    super(...args);
    for(const value of Object.values(this.exports)) if(value instanceof WebAssembly.Memory) memories.push(value);
  }
};
const {Projection}=await import(pathToFileURL(process.argv[2]).href);
crypto.getRandomValues = values => { values.fill(0x12345678); return values; };
const warm=new Projection(1);
for(let i=0;i<100;i++) warm.insert(['x'],warm.length());
warm.destroy();
global.gc(); global.gc();
const before=process.memoryUsage();
const wasmBefore=memories.reduce((n,m)=>n+m.buffer.byteLength,0);
globalThis.kept=[];
for(let actor=1;actor<=8;actor++) {
  const p=new Projection(actor);
  for(let i=0;i<6000;i++) p.insert(['x'],p.length());
  globalThis.kept.push(p);
}
global.gc(); global.gc();
const after=process.memoryUsage();
const wasmAfter=memories.reduce((n,m)=>n+m.buffer.byteLength,0);
const sequence=globalThis.kept[0].sequence();
const flat = typeof sequence[0][0] === 'number';
const dense=flat ? [sequence[0],Array.from(sequence[1])] : [sequence[0],sequence[1].map(([c,f])=>f?[c,Array.from(f)]:[c])];
console.log(JSON.stringify({projections:8,framesPerProjection:6000,heapUsedDelta:after.heapUsed-before.heapUsed,wasmBefore,wasmAfter,wasmGrowth:wasmAfter-wasmBefore,storageV8:serialize(sequence).length,storageV8Dense:serialize(dense).length,storageJSON:Buffer.byteLength(JSON.stringify(sequence)),retainedInsertions:flat ? (sequence[0].length-sequence[0][0])/6 : sequence[1].length}));
