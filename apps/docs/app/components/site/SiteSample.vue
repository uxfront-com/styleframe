<script setup lang="ts">
import type { FunctionalComponent } from "vue";

// A code sample from content/home/, highlighted when the site is built, in the
// kit's code panel, named after its file.
const { name } = defineProps<{
	/** The sample's file name in content/home/, without `.md`. */
	name: string;
}>();

const { data: sample } = await useAsyncData(`home-${name}`, () =>
	queryCollection("home").where("stem", "=", `home/${name}`).first(),
);

// The highlighted <pre> with its classes only: without the prose components,
// it would also carry its whole source as a `code` attribute.
const Pre: FunctionalComponent<{ class?: string }> = (props, { slots }) =>
	h("pre", { class: props.class }, slots.default?.());
Pre.inheritAttrs = false;
</script>

<template>
	<UxCode v-if="sample" :title="sample.title">
		<ContentRenderer
			:value="sample"
			:prose="false"
			:components="{ pre: Pre }"
		/>
	</UxCode>
</template>
