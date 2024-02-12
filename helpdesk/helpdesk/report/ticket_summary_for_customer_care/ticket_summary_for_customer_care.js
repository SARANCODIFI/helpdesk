// Copyright (c) 2024, Frappe Technologies and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Ticket Summary for Customer Care"] = {

	filters: [
		{
			fieldname: "based_on",
			label: __("Based On"),
			fieldtype: "Select",
			options: [
				"Customer",
				"Ticket Type",
				"Ticket Priority",
				"Assigned To",
				"Branch"
			],
			default: "Customer",
			reqd: 1,
		},

		{
            fieldname: "customer",
            label: __("Customer ID/Name"),
            fieldtype: "Link",
			options: "Customer",
            depends_on: "eval:doc.based_on=='Customer'",
        },

		{
            fieldname: "branch",
            label: __("Branch"),
            fieldtype: "Link",
			options: "Branch",
            depends_on: "eval:doc.based_on=='Branch'",
        },

		{
			fieldname: "source",
			label: __("Source"),
			fieldtype: "Select",
			fieldtype: "Link",
			options: "Source",
			// options: [
			// 	"",
			// 	{ label: __("Agent"), value: "Agent" },
			// 	{ label: __("Web"), value: "Web" },
			// 	{ label: __("Mobile"), value: "Mobile" },
			// 	{ label: __("Mail"), value: "Mail" },
			// 	{ label: __("Portal"), value: "Portal" },
			// ],
		},
		

		{
            fieldname: "query_type",
            label: __("Query Type"),
            fieldtype: "Link",
			options: "Query Type",
            depends_on: "eval:doc.based_on=='Customer'",
        },

		{
            fieldname: "call_type",
            label: __("Call Type"),
            fieldtype: "Link",
			options: "Call Type",
            depends_on: "eval:doc.based_on=='Customer'",
        },

		{
			fieldname: "from_date",
			label: __("From Date"),
			fieldtype: "Date",
			default: frappe.defaults.get_global_default("year_start_date"),
			reqd: 1,
		},
		{
			fieldname: "to_date",
			label: __("To Date"),
			fieldtype: "Date",
			default: frappe.defaults.get_global_default("year_end_date"),
			reqd: 1,
		},
		{
			fieldname: "status",
			label: __("Status"),
			fieldtype: "Select",
			options: [
				"",
				{ label: __("Open"), value: "Open" },
				{ label: __("Replied"), value: "Replied" },
				{ label: __("Resolved"), value: "Resolved" },
				{ label: __("Closed"), value: "Closed" },
				{ label: __("Cancel"), value: "Cancel" },
			],
		},
		{
			fieldname: "priority",
			label: __("Ticket Priority"),
			fieldtype: "Link",
			options: "HD Ticket Priority",
		},
		{
			fieldname: "contact",
			label: __("Contact"),
			fieldtype: "Link",
			options: "Contact",
		},
		{
			fieldname: "assigned_to",
			label: __("Assigned To"),
			fieldtype: "Link",
			options: "User",
		},
		{
			label: __("Agent Group"),
			fieldname: "agent_group",
			fieldtype: "Link",
			options: "HD Team",
		},
		
	],
}

