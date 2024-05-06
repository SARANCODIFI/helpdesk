import frappe

@frappe.whitelist(allow_guest=True)
def ticket_comment(ticket_id,new_comment):
    try:

        ticket = frappe.get_doc("HD Ticket", ticket_id)

        doc = frappe.get_doc({
            'doctype': 'Comment',
            'comment_type': 'Comment',
            'comment_email': frappe.session.user,
            'content':new_comment,
            'reference_name':ticket_id,
            'reference_doctype': 'HD Ticket'
        })
        doc.insert(ignore_permissions=True)
        frappe.db.commit()

        return "Comment Added"
        
    except :
        return {
            "status": "error",
            "message": "HD Ticket Is Not Present",
            "ticket_id": ticket_id
        }
