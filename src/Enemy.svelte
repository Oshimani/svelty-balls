<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
    import { enemySpeedMutator, gameTick, playgroundRadius } from "./gameStore";

    export let id;

    let x: number = 0;
    let y: number = 0;

    let velocityX: number;
    let velocityY: number;

    let enemyType = "default";

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

    const initEnemyType = () => {
        const rng = Math.random();
        if (rng > 0.9) {
            enemyType = "friendly";
        } else {
            enemyType = "default";
        }
    };

    $: distanceFromCenter = Math.sqrt(x * x + y * y);

    $: enemyColor = () => {
        switch (enemyType) {
            case "friendly":
                return "#5bff08";

            default:
                return "red";
        }
    };

    const move = (speedMutator: number) => {
        x = x + velocityX * speedMutator;
        y = y + velocityY * speedMutator;
    };

    const handleOnClick = () => {
        dispatch("kill", { id, enemyType });
    };

    const checkDeathCondition = () => {
        if (distanceFromCenter > $playgroundRadius) {
            dispatch("die", { id, enemyType });
        }
    };

    onMount(() => {
        initMomentum();
        initEnemyType();

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
        class="enemy-canvas"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g id="enemy-hitbox" on:mousedown={() => handleOnClick()}>
            <circle
                cx="50"
                cy="50"
                r="50"
                fill={enemyColor()}
                stroke="black"
            />
            <circle cx="28.8889" cy="33.3333" r="7.77778" fill="white" />
            <line
                x1="20.1709"
                y1="21.7523"
                x2="44.6153"
                y2="30.6412"
                stroke="black"
            />
            <circle
                r="7.77778"
                transform="matrix(-1 0 0 1 71.1111 33.3333)"
                fill="white"
            />
            <line
                y1="-0.5"
                x2="26.0104"
                y2="-0.5"
                transform="matrix(-0.939793 0.341743 0.341743 0.939793 80 22.2222)"
                stroke="black"
            />
            <path d="M50 90L91.1111 64.4444H8.88889L50 90Z" fill="white" />
        </g>
    </svg>
</div>

<style>
    .enemy {
        position: absolute;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
    .enemy-canvas {
        transform: scale(0.5);
        pointer-events: none;
    }
    #enemy-hitbox {
        pointer-events: initial;
    }
</style>
