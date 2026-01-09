<script>
    import { onMount } from "svelte";
    import Icon from "@iconify/svelte";

    let theme = "winter";

    onMount(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            theme = savedTheme;
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            theme = "dark";
        }
        document.documentElement.setAttribute("data-theme", theme);
    });

    function toggleTheme() {
        theme = theme === "corporate" ? "dark" : "corporate";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }
</script>

<button
    class="btn btn-ghost btn-circle"
    on:click={toggleTheme}
    aria-label="Toggle Theme"
>
    {#if theme === "corporate"}
        <!-- Sun Icon -->
        <Icon icon="line-md:sunny-twotone-loop" width="48" height="48" />
    {:else}
        <!-- Moon Icon -->
        <Icon
            icon="line-md:sunny-filled-loop-to-moon-filled-loop-transition"
            width="28"
            height="28"
        />
    {/if}
</button>
