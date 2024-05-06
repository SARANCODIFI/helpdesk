import frappe
from frappe.custom.doctype.property_setter.property_setter import make_property_setter

def execute():
    frappe.reload_doc('helpdesk', 'doctype', 'hd_ticket', force=True)
    hd_ticket_doctype = frappe.get_doc("DocType", "HD Ticket")
    status_field = [field for field in hd_ticket_doctype.fields if field.fieldname == 'ticket_type'][0]
    status_field.label = "Ticket Type(Sub Call Type)"
    status_field = [field for field in hd_ticket_doctype.fields if field.fieldname == 'agent_group'][0]
    status_field.label = "Agent Group(Team)"
    status_field.fetch_from = "ticket_type.fsl_assigned_to_department"
    status_field = [field for field in hd_ticket_doctype.fields if field.fieldname == 'priority'][0]
    status_field.fetch_from = "ticket_type.priority"
    # status_field = [field for field in hd_ticket_doctype.fields if field.fieldname == 'fsl_call_type'][0]
    # status_field.insert_after = "cb00"
    hd_ticket_doctype.save()
