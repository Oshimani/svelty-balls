<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
    import { enemySpeedMutator, gameTick, playgroundRadius } from "./gameStore";

    export let id;
    let radius: number = 20;
    let _strokeWidth: number = 2;

    let x: number = 0;
    let y: number = 0;

    let velocityX: number;
    let velocityY: number;

    let unsubscribe;

    const dispatch = createEventDispatcher();

    const initMomentum = () => {
        const xSign = Math.random();
        const ySign = Math.random();
        let x = Math.random();
        let y = Math.random();
        if (xSign > 0.5) x = x * -1;
        if (ySign > 0.5) y = y * -1;

        velocityX = x;
        velocityY = y;
        return { x, y };
    };

    $: distanceFromCenter = Math.sqrt(x * x + y * y);

    const move = (speedMutator: number) => {
        x = x + velocityX * speedMutator;
        y = y + velocityY * speedMutator;
    };

    const handleOnClick = () => {
        dispatch("kill", id);
    };

    const checkDeathCondition = () => {
        if (distanceFromCenter > $playgroundRadius) {
            dispatch("die", id);
        }
    };

    onMount(() => {
        const { x, y } = initMomentum();

        // GAMELOOP HERE
        unsubscribe = gameTick.subscribe((value) => {
            move($enemySpeedMutator);
            checkDeathCondition();
        });
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="enemy" style="left: calc(50% + {x}px); top: calc(50% + {y}px);">
    <svg
        class="canvas"
        style="height:{radius * 2 + _strokeWidth};width:{radius * 2 +
            _strokeWidth}"
    >
        <!-- ENEMY BODY -->
        <circle
            class="enemy-body"
            on:mousedown={handleOnClick}
            r="{radius}px"
            cx="50%"
            cy="50%"
            stroke="black"
            stroke-width={_strokeWidth}
        />

        <!-- CROSSHAIR -->
        <g class="crosshair">
            <circle
                r="{radius * 0.5}px"
                cx="50%"
                cy="50%"
                stroke="black"
                fill="none"
                stroke-width={_strokeWidth * 0.6}
            />
            <line
                x1="10%"
                y1="10%"
                x2="90%"
                y2="90%"
                stroke="black"
                stroke-width={_strokeWidth * 0.6}
            />
            <line
                x1="90%"
                y1="10%"
                x2="10%"
                y2="90%"
                stroke="black"
                stroke-width={_strokeWidth * 0.6}
            />
        </g>
    </svg>
</div>

<style>
    .enemy {
        position: absolute;
        transform: translate(-50%, -50%);
    }

    .crosshair {
        display: none;
    }
    .enemy:hover .crosshair {
        display: initial;
        pointer-events: none;
    }

    .enemy-body {
        fill: rgb(255, 0, 0);
    }
    .canvas {
    }
</style>
