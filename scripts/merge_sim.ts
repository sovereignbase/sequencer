import { waitFor } from '@sovereignbase/utils'

const buf = new Uint32Array(1)

const realms = []

for (let i = 0; i < 3; i++) {
  await waitFor(1)
  const realm = []
  void crypto.getRandomValues(buf)
  void realm.push(buf[0])
  void realm.push(Date.now() >>> 0)
  void realm.push(0)
  void realms.push(realm)
}

console.log(realms)
