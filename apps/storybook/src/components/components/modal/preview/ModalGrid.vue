<script setup lang="ts">
import Modal from "../Modal.vue";
import ModalHeader from "../ModalHeader.vue";
import ModalBody from "../ModalBody.vue";
import ModalFooter from "../ModalFooter.vue";
import ModalTitle from "../ModalTitle.vue";
import ModalDescription from "../ModalDescription.vue";

const colors = ["neutral", "light", "dark"] as const;
const variants = ["solid", "soft", "subtle"] as const;

const capitalize = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1);
</script>

<template>
	<div class="modal-section">
		<div v-for="variant in variants" :key="variant">
			<div class="modal-label">{{ variant }}</div>
			<div class="modal-row">
				<div
					v-for="color in colors"
					:key="`${variant}-${color}`"
					class="modal-stage"
				>
					<Modal
						:color="color"
						:variant="variant"
						:aria-labelledby="`modal-grid-${variant}-${color}`"
					>
						<ModalHeader :color="color" :variant="variant">
							<ModalTitle :id="`modal-grid-${variant}-${color}`"
								>{{ capitalize(variant) }} {{ capitalize(color) }}</ModalTitle
							>
						</ModalHeader>
						<ModalBody>
							<ModalDescription
								>This is a {{ variant }} {{ color }} modal.</ModalDescription
							>
						</ModalBody>
						<ModalFooter :color="color" :variant="variant">
							Footer content
						</ModalFooter>
					</Modal>
				</div>
			</div>
		</div>
	</div>
</template>
