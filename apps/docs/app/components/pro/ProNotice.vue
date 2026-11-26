<template>
	<UAlert variant="soft" color="neutral">
		<template #title>
			<ProseStrong class="text-lg">
				<Icon name="material-symbols:award-star" class="text-warning" />
				Pro Feature
			</ProseStrong>
		</template>
		<template #description>
			<ProseP class="text-sm my-2">
				Unlock advanced capabilities with styleframe Pro. This feature requires a Pro license to
				access.
			</ProseP>

			<UButton class="mt-2" color="neutral" size="sm" to="/pricing"> Upgrade to Pro </UButton>
		</template>
	</UAlert>
</template>
