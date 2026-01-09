<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "@iconify/svelte";

	interface LocaleInfo {
		locale: string;
		path: string;
	}

	interface Props {
		currentLocale?: string;
		localeList?: LocaleInfo[];
	}

	let { currentLocale: initialLocale = "en", localeList = [] }: Props = $props();

	let currentLocale = $state("en");

	function toggleLanguage() {
		// Find the other language
		const otherLocale = localeList.find(loc => loc.locale !== currentLocale);
		
		if (!otherLocale) return;
		
		// Save to localStorage
		localStorage.setItem("preferredLocale", otherLocale.locale);
		
		// Navigate to the other language
		window.location.href = otherLocale.path || "/";
	}

	onMount(() => {
		// Detect current locale from URL path
		const path = window.location.pathname;
		const pathSegments = path.split("/").filter(Boolean);
		
		// Check if first segment is a locale
		if (pathSegments.length > 0 && localeList.some((loc) => loc.locale === pathSegments[0])) {
			currentLocale = pathSegments[0];
		} else {
			// Default to English if no locale prefix
			currentLocale = "en";
		}
		
		// Update localStorage with detected locale
		localStorage.setItem("preferredLocale", currentLocale);
	});
</script>

<button
	class="btn btn-ghost btn-circle relative group"
	onclick={toggleLanguage}
	aria-label="Toggle Language"
	title="Switch to {currentLocale === 'en' ? 'Español' : 'English'}"
>
	<Icon icon="mdi:translate" width="28" height="28" class="group-hover:rotate-12 transition-transform" />
	<span class="absolute -bottom-1 -right-1 text-xs font-bold bg-primary text-primary-content rounded-full w-5 h-5 flex items-center justify-center transition-all group-hover:scale-125 shadow-md">
		{currentLocale.toUpperCase()}
	</span>
</button>