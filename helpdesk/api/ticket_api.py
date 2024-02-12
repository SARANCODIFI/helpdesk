from __future__ import unicode_literals
import frappe
from frappe import _

@frappe.whitelist()
def get_ticket_summary(customer):
    if not customer:
        frappe.throw(_("Please provide a customer name"))

    all_tickets_count = frappe.db.count('HD Ticket', filters={'customer': customer})
    
    open_tickets_count = frappe.db.count('HD Ticket', filters={
        'customer': customer,
        'status': 'Open'
    })

    closed_resolved_tickets_count = frappe.db.count('HD Ticket', filters={
        'customer': customer,
        'status': ['in', ['Closed', 'Resolved']]
    })

    return {
        'all_tickets': all_tickets_count,
        'open_tickets': open_tickets_count,
        'closed_resolved_tickets': closed_resolved_tickets_count
    }
