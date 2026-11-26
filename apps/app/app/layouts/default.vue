<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<Array<Array<NavigationMenuItem>>>([
	[
		{
			label: "Dashboard",
			type: "label",
		},
		{
			label: "Activate License",
			icon: "i-lucide-key",
			active: true,
		},
	],
	[
		{
			label: "Customer Portal",
			icon: "i-lucide-user-star",
			to: "https://polar.sh/styleframe/portal",
			target: "_blank",
		},
		{
			label: "Log Out",
			icon: "i-lucide-log-out",
			to: "/logout",
		},
	],
]);
</script>

<template>
	<AppHeader />
	<UMain class="flex flex-col">
		<UContainer class="flex-1">
			<UPage>
				<template #left>
					<UPageAside>
						<UNavigationMenu
							orientation="vertical"
							:items="items"
							class="data-[orientation=vertical]:w-48"
						/>
					</UPageAside>
				</template>
				<slot />
			</UPage>
		</UContainer>
		<AppFooter />
	</UMain>
</template>
