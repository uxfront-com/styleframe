<script setup lang="ts">
import Modal from "../Modal.vue";
import ModalHeader from "../ModalHeader.vue";
import ModalBody from "../ModalBody.vue";
import ModalFooter from "../ModalFooter.vue";
import ModalTitle from "../ModalTitle.vue";
import ModalDescription from "../ModalDescription.vue";

const sizes = ["sm", "md", "lg"] as const;
const sizeTitles: Record<string, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};
</script>

<template>
	<div class="modal-section">
		<div v-for="size in sizes" :key="size">
			<div class="modal-label">{{ sizeTitles[size] }} ({{ size }})</div>
			<div class="modal-stage">
				<Modal :size="size" :aria-labelledby="`modal-size-${size}`">
					<ModalHeader :size="size">
						<ModalTitle :id="`modal-size-${size}`"
							>{{ sizeTitles[size] }} Modal</ModalTitle
						>
					</ModalHeader>
					<ModalBody :size="size">
						<ModalDescription
							>This is a {{ size }} modal showing the
							{{ sizeTitles[size].toLowerCase() }} size
							variant.</ModalDescription
						>
					</ModalBody>
					<ModalFooter :size="size"> Footer content </ModalFooter>
				</Modal>
			</div>
		</div>
	</div>
</template>
