<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import Enemy from "./Enemy.svelte";
    import {
        gameTick,
        playgroundRadius,
        enemySpawnRateMutator,
        gameTimeLimit,
    } from "./gameStore";

    const dispatch = createEventDispatcher();

    // timer refs
    let gameInterval;
    let timerInterval;

    let score: number = 0;
    let enemies: any[] = [];
    let remainingTime: number = $gameTimeLimit;

    let hits: number = 0;
    let clicks: number = 0;
    $: accuracy = ((hits / clicks) * 100).toFixed(1);

    $: isGameOver = remainingTime <= 0;

    onMount(() => {
        // INIT GAME
        playgroundRadius.set(400);

        // GAMELOOP
        gameInterval = setInterval(() => {
            // check if game is over
            if (isGameOver) {
                clearInterval(gameInterval);
                clearInterval(timerInterval);
            }

            spawnEnemy(1 - $enemySpawnRateMutator / 100);

            // tick game
            gameTick.update((t) => t + 1);
        }, 20);

        // start game clock
        timerInterval = setInterval(() => {
            remainingTime--;
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
    });

    const spawnEnemy = (breakpoint: number) => {
        const chance = Math.random();
        if (chance > breakpoint) {
            console.log("Spawned enemy");

            enemies = [...enemies, { id: $gameTick }];
        }
    };

    const handleEnemyKill = ({ id, enemyType }) => {
        enemies = enemies.filter((e) => e.id !== id);
        if (enemyType === "default") {
            score++;
        } else if (enemyType === "friendly") {
            score--;
        }
    };

    const handleEnemyDie = ({ id, enemyType }) => {
        enemies = enemies.filter((e) => e.id !== id);

        if (enemyType === "default") {
            score--;
            remainingTime--;
        } else if (enemyType === "friendly") {
            remainingTime++;
        }
    };

    const handleClickOnCanvas = (e) => {
        if (e.path.findIndex((element) => element.id === "enemy-hitbox") > -1) {
            // hit
            hits++;
        } else {
            // miss
        }
        clicks++;
    };
</script>

<div class="game">
    {#if isGameOver}
        <div class="game-over-backdrop">
            <section class="game-over">
                <h1>Game Over</h1>
                You scored: {score}

                <button on:click={() => dispatch("close", null)}
                    >Back to Menu</button
                >
                <button
                    on:click={() =>
                        dispatch("close", { name: "PlayerOne", score })}
                    disabled>Submit Score</button
                >
            </section>
        </div>
    {/if}

    <section class="info">
        Score: {score}
        Remaining time: {remainingTime}
        Accuracy: {isNaN(Number(accuracy)) ? "-" : accuracy + "%"}
    </section>

    <!-- PLAYGROUND -->
    <div id="playground-container" class:isGameOver>
        <svg class="canvas game-canvas">
            <circle
                id="valid-area"
                r="{$playgroundRadius}px"
                cx="50%"
                cy="50%"
                stroke="black"
                stroke-width="2"
            />
        </svg>

        <!-- ENEMIES -->
        <div on:mousedown={(e) => handleClickOnCanvas(e)} class="canvas">
            <div id="enemy-canvas">
                {#each enemies as enemy (enemy.id)}
                    <Enemy
                        {...enemy}
                        on:kill={(event) => handleEnemyKill(event.detail)}
                        on:die={(event) => handleEnemyDie(event.detail)}
                    />
                {/each}
            </div>
        </div>

        <!-- CENTER DOT -->
        <svg class="canvas over-enemies">
            <circle
                id="center-dot"
                r="30px"
                cx="50%"
                cy="50%"
                fill="rgb(240, 240, 240)"
                stroke="black"
                stroke-width="2"
            />
        </svg>
    </div>
</div>

<style>
    .game {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .info {
        text-align: center;
    }

    #playground-container {
        position: relative;
        flex-grow: 1;
    }

    .canvas {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .game-canvas {
        background-color: rgb(240, 240, 240);
    }
    #enemy-canvas {
        position: relative;
        width: 100%;
        height: 100%;
    }

    #valid-area {
        fill: white;
    }

    .over-enemies {
        pointer-events: none;
    }
    #center-dot {
        pointer-events: initial;
    }

    .game-over-backdrop {
        position: absolute;
        z-index: 100;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .game-over {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        background-color: white;
        border: 3px solid black;
        padding: 16px 32px;
    }

    .game-over h1 {
        margin: 0;
    }
    .isGameOver {
        filter: blur(8px);
    }
</style>
