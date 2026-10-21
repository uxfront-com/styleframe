<script setup lang="ts">
import { CREDIT, LEGAL_LINKS } from "~/data/site";

// Replaces Docus's, which only shows the year: main's credit and the legal
// links. Docus 5.13 no longer reads footer links from app.config.ts.
</script>

<template>
	<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
		<span>{{ CREDIT }}</span>
		<ULink
			v-for="link in LEGAL_LINKS"
			:key="link.to"
			:to="link.to"
			class="text-muted hover:text-default"
		>
			{{ link.label }}
		</ULink>
	</div>
</template>
