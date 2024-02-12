
frappe.listview_settings['HD Ticket'] = {
    onload: function (listview) {
        if (frappe.user.has_role("Admin")){

        }
        else if (frappe.user.has_role("Customer Care")) {
            frappe.set_route("List", "HD Ticket", "List", { "fsl_internal_ticket": ["Equals", 0], "owner": ["like", frappe.session.user] }, );
            $('head').append('<style>.filter-selector { display: none !important; }</style>');

        } 
        else if (frappe.user.has_role("Branch Care")){
            // console.log("Branch CAre")
            frappe.call({
                method: 'helpdesk.helpdesk.doctype.hd_ticket.api.get_employee',
                args: {
                    email_id : frappe.session.user
                },
                callback: function(response) {
                    console.log(response,"response")
                    if (response.message) {
                        frappe.set_route("List", "HD Ticket", "List", {
                            "fsl_internal_ticket": ["Equals", 1],
                            "fsl_sthrough_branch": ["Equals", 1],
                            "fsl_branch_id": response.message.emp_branch,
                            "fsl_source": ["In", "Agent", "Mail", "Portal", "RM"]
                        });
                        
                    } else {
                        console.error('Error in your_custom_method:', response.error);
                    }
                }
            });
            
            $('head').append('<style>.filter-selector { display: none !important; }</style>');

        }
        else if (frappe.user.has_role("Department Agent - IT")){
            frappe.set_route("List", "HD Ticket", "List", { "_assign": ["like", frappe.session.user],"owner": ["like", frappe.session.user] });
            $('head').append('<style>.filter-selector { display: none !important; }</style>');

        }  
        else if (frappe.user.has_role("RM")){

            frappe.set_route("List", "HD Ticket", "List", { "owner": ["like", frappe.session.user] });
            $('head').append('<style>.filter-selector { display: none !important; }</style>');
        }    
        
    }
};
