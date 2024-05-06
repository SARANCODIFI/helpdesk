import { computed, ComputedRef } from "vue";
import { defineStore } from "pinia";
import { createListResource } from "frappe-ui";

type queryType = {
	name: string;
	// sub_call_type: string;
	// priority: string;
};

export const usequeryType = defineStore("queryType", () => {
	const d__ = createListResource({
		doctype: "Query Type",
		fields: ["*"],
		auto: true,
		pageLength: 99999,
	});

	const options: ComputedRef<Array<queryType>> = computed(
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
