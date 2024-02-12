import frappe

@frappe.whitelist(allow_guest=True)
def create_ticket(parent,source,query_type,subject,call_type,ticket_type):
    ticket = frappe.new_doc("HD Ticket")
    ticket.fsl_source = source
    ticket.parent_ticket = parent
    ticket.fsl_query_type = query_type
    ticket.subject = subject
    ticket.fsl_call_type = call_type
    ticket.ticket_type = ticket_type
    ticket.insert()
    return [ticket.name,ticket.status,ticket.fsl_call_type,ticket.ticket_type ]

@frappe.whitelist(allow_guest=True)
def save_child(doc):
    
    doc.save()
    frappe.errprint("Successfully saved")