// Copyright (c) 2023, Frappe Technologies and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Customer Ticket Summary"] = {
	"filters": [
		{
			fieldname: "based_on",
			label: __("Based On"),
			fieldtype: "Select",
			options: [
				"Customer",
				"HD Ticket Type",
				"Ticket Priority",
				"Assigned To",
			],
			default: "Contact",
			reqd: 1,
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
			],
		},
		{
			fieldname: "priority",
			label: __("Ticket Priority"),
			fieldtype: "Link",
			options: "HD Ticket Priority",
		},
		{
			fieldname: "assigned_to",
			label: __("Assigned To"),
			fieldtype: "Link",
			options: "User",
		},
		{
			fieldname: "query_type",
			label: __("Query Type"),
			fieldtype: "Link",
			options: "Query Type",
		},
		{
			fieldname: "call_type",
			label: __("Call Type"),
			fieldtype: "Link",
			options: "Call Type",
		},
		{
			fieldname: "ticket_type",
			label: __("Ticket Type(Sub Call Type)"),
			fieldtype: "Link",
			options: "HD Ticket Type",
		},
		{
			fieldname: "agent_group",
			label: __("Agent Group(Team)"),
			fieldtype: "Link",
			options: "HD Team",
		},

	]
};
