// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("HD Ticket Type", {
	refresh: function (frm) {},
})

frappe.listview_settings['HD Ticket Type'] = {
    onload: function(listview) {
        // Filter the list based on the current user
        listview.page.fields_dict.priority.get_query = function() {
            return {
                filters: [
                    ['owner', '=', frappe.session.user]
                ]
            };
        };
    }
};
