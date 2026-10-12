import {readFileSync,writeFileSync} from 'node:fs';
import {gzipSync,brotliCompressSync} from 'node:zlib';
const size=data=>({raw:data.length,gzip:gzipSync(data).length,brotli:brotliCompressSync(data).length});
const report={};
for(const [key,path] of [['baseline','temp/strip-runs/baseline-dist/index.js'],['current','dist/index.js']]) {
 const source=readFileSync(path,'utf8');
 const match=source.match(/binaryDecode\(("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\)/);
 if(!match)throw Error('WASM literal missing');
 const binary=Function(`return ${match[1]}`)();
 const wasm=Uint8Array.from(binary,c=>(~c.charCodeAt(0)>>8)&c.charCodeAt(0));
 report[key]={combined:size(Buffer.from(source)),wasm:size(wasm),javascriptWithoutWasmLiteral:size(Buffer.from(source.replace(match[1],'""')))};
 writeFileSync(`temp/strip-runs/${key}.wasm`,wasm);
}
writeFileSync('temp/strip-runs/artifact-sizes.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
