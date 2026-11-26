<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const items = computed<Array<NavigationMenuItem>>(() => []);
</script>

<template>
	<UNavigationMenu class="max-sm:hidden" :items="items" />
</template>
