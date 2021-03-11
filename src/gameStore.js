import { writable } from 'svelte/store';

export const gameTick = writable(0);
// playgroundradius in pixels
export const playgroundRadius = writable(0);

export const enemySpeedMutator = writable(3);
// 0.95
export const enemySpawnRateMutator = writable(5);
// gameduration in seconds
export const gameTimeLimit = writable(30);
