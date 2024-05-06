import { computed, ComputedRef } from "vue";
import { defineStore } from "pinia";
import { createListResource } from "frappe-ui";

type CallType = {
	name: string;
	// sub_call_type: string;
	// priority: string;
};

export const useCallType = defineStore("CallType", () => {
	const d__ = createListResource({
		doctype: "Call Type",
		// fields: ["*"],
		auto: true,
		pageLength: 99999,
	});
	
	const options: ComputedRef<Array<CallType>> = computed(
		() => d__.list?.data || []
	);
	const dropdown = computed(() =>
		options.value.map((q) => ({
			label: q.name,
			value: q.name,
		}))
	);

	return {
		dropdown,
		options,
	};
});
