<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		icon: string;
		width?: string | number;
		height?: string | number;
		class?: string;
	}

	let { icon, width = "24", height = "24", class: className = "" }: Props = $props();
</script>

<Icon {icon} {width} {height} class={className} />
