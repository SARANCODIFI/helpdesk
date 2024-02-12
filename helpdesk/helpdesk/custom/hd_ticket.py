# Copyright (c) 2023, Frutter Software Labs (P) Ltd and contributors
# For license information, please see license.txt

import frappe

def hd_ticket_email(self, event):
    frappe.errprint("O Hooks Called")
    cus = self.customer
    self.raised_by = frappe.db.get_value("Customer", self.customer, "email_id") if self.customer else None
    # self.save()
    frappe.errprint(self.owner)
    frappe.errprint(frappe.db.exists("Employee", {"user_id": self.owner}))
    if frappe.db.exists("Employee", {"user_id": self.owner}):
        frappe.errprint("Employee Checked")
        frappe.call(
            "frappe.share.add",
            doctype=self.doctype,
            name=self.name,
            user=frappe.session.user,
            read=1,
            write=1,
            share=1,
            callback=after_insert_callback
        )
        frappe.errprint("O Hooks Called Done")
    elif frappe.db.exists("Customer", {"email_id": self.raised_by}):
        frappe.errprint("O Hooks Called Customer")
        share_hd_agents(self, event)

@frappe.whitelist()
def share_hd_agents(self, event):
    frappe.errprint(f'Type of self: {type(self)}')
    frappe.errprint(f'self.doctype: {self.doctype}')
    frappe.errprint(f'self.name: {self.name}')
    hd_agents = frappe.get_all(
        "HD Agent",
        filters={"is_active": 1},
        as_list=False
    )
    frappe.errprint(hd_agents)
    customer_care_agents = [agent['name'] for agent in hd_agents if is_customer_care(agent['name'])]

    for hd_agent in customer_care_agents:
        frappe.call(
            "frappe.share.add",
            doctype=self.doctype,
            name=self.name,
            user=hd_agent,
            read=1,
            write=1,
            share=1,
            callback=after_insert_callback
        )

def after_insert_callback(response):
    frappe.msgprint(('After Insert function called! Server response: {0}').format(response.message))

    

def is_customer_care(agent):
    roles = frappe.get_roles(agent)
    return "Customer Care" in roles

@frappe.whitelist()
def get_enabled_roles_for_employee(user_id):
    try:
        # Get the employee document
        frappe.errprint("emp")
        user = frappe.get_doc("User", user_id)
        frappe.errprint(user.email)
        # Get the roles assigned to the employee
        roles = user.get("roles")
        frappe.errprint(roles)
        # Filter roles that are enabled
        enabled_roles = [role.role for role in roles if role.is_default]
        # frappe.errprint(enabled_roles)
        return enabled_roles

    except Exception as e:
        frappe.errprint('error')
        frappe.log_error(f"Error in get_enabled_roles_for_employee: {str(e)}")
        return None

@frappe.whitelist()
def assign_to(ticketType):
    ticket_type_doc = frappe.get_doc('HD Ticket Type', ticketType)
    hd_team_doc = frappe.get_doc('HD Team', ticket_type_doc.fsl_assigned_to_department)
    string_array = [{"value": item.user, "label": f"{item.user}"} for item in hd_team_doc.users]
    returnValue = {
        'assign_to': string_array,
        'priority':ticket_type_doc.priority,
        'agentGroup': ticket_type_doc.fsl_assigned_to_department
        }
    return returnValue



