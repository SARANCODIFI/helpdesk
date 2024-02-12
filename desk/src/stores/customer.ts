import { computed, ComputedRef } from "vue";
import { defineStore } from "pinia";
import { createListResource } from "frappe-ui";

type Customer = {
	name: string;
	customer_name: string;
	fsl_pan_card: string;
	mobile_no: string;
	email_id: string;
	// priority: string;
};

export const useCustomer = defineStore("Customer", () => {
	const d__ = createListResource({
		doctype: "Customer",
		fields: ["*"],
		auto: true,
		pageLength: 1000,
		search: "",
	});

	const options: ComputedRef<Array<Customer>> = computed(
		() => d__.list?.data || []
	);
	
	const dropdown = computed(() =>
		options.value.map((q) => ({
			label: q.name,
			value: q.name,
			contact: {
				customer_name: q.customer_name,
				fsl_pan_card: q.fsl_pan_card,
				mobile_no: q.mobile_no,
				email_id: q.email_id
			}
		}))
	);

	// const dropdown = computed(() => {
	// 		let data = options.value
	// 		let data1 = options.value
	// 		data.map((q) => ({
	// 			label: q.name,
	// 			value: q.name,
	// 		}))
	// 		data1.map((q) => ({
	// 			label: q.customer_name,
	// 			value: q.customer_name,
	// 		}))
	// 		let mergedArr = [...data, ...data1]
	// 		mergedArr.map((q) => ({
	// 				label: q.name,
	// 				value: q.name,
	// 			}))
	// 		return mergedArr
	// 	}
	// );
	
	console.log(d__.search,'d__.search');
	
	

	return {
		dropdown,
		options,
		d__
	};
});
