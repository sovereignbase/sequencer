import { expect } from 'vitest';
import { Projection } from '../../src/typescript/class.js';
import type { Gossip, Sequence } from '../../src/typescript/types/type.js';
export type Replica<T> = Projection<T>;
let actor = 10000;
export async function create_seed<T>(values: Array<T>): Promise<Projection<T>> {
    const sequence = new Projection<T>(actor++);
    await sequence.insert(values, 0);
    return sequence;
}
export async function deliver<T>(base: Sequence<T>, mutations: Array<Gossip<T>>, restartAt?: number): Promise<Projection<T>> {
    let sequence = new Projection<T>(actor++, base);
    for (let index = 0; index < mutations.length; ++index) {
        await sequence.apply(mutations[index]);
        if (index + 1 === restartAt) {
            sequence = new Projection<T>(actor++, await sequence.sequence());
            for (let replay = 0; replay <= index; ++replay)
                await sequence.apply(mutations[replay]);
        }
    }
    return sequence;
}
export async function expect_converged<T>(expected: Projection<T>, actual: Projection<T>): Promise<void> {
    expect(await actual.length()).toBe(await expected.length());
    for (let position = 0; position < await expected.length(); ++position)
        expect(await actual.value(position)).toEqual(await expected.value(position));
}
export function shuffle_mutations<T>(mutations: Array<Gossip<T>>, seed: number): Array<Gossip<T>> {
    const shuffled = [...mutations];
    for (let index = shuffled.length - 1; index > 0; --index) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const other = seed % (index + 1);
        [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
}
