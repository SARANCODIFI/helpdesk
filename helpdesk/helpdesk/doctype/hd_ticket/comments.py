import frappe
from datetime import datetime, timedelta
from bs4 import BeautifulSoup

@frappe.whitelist(allow_guest=True)
def create_comment(com,commented_by,name):
    comment = frappe.new_doc("Comment")
    comment.reference_doctype = "HD Ticket"
    comment.reference_name = name
    comment.comment_type = "Comment"
    comment.comment_email = commented_by
    comment.content = com
    comment.insert()

    
    soup = BeautifulSoup(com, 'html.parser')
    text_without_tags = soup.get_text(strip=True)
    frappe.errprint(text_without_tags)
    ticket = frappe.get_doc("HD Ticket", name)
    ticket.all_comments=ticket.all_comments + "\n\n\nAdded By :"+commented_by + "  " +"added_on :"+frappe.utils.now() +"  "+ "note :" + text_without_tags
    #str(ticket.all_comments) +
    # ticket.append("notes",{
    #     "comment": comment.reference_name,
    #     "note": text_without_tags,
    #     "added_by": commented_by,
    #     "added_on": frappe.utils.now()
    # })
    # # ticket += f"\n\n{ticket}"
    ticket.save()
    # return [comment.reference_doctype,comment.reference_name,comment.comment_type,comment.comment_email,comment.content ]

@frappe.whitelist()
def fetch_comments(docname, doctype):
    return frappe.get_all(doctype, filters={'parent': docname}, fields=['comment']) # Modify fields as required

@frappe.whitelist(allow_guest=True)
def demo_method(txt):
	return frappe.get_all(
			'HD Agent',
			filters={'is_active': 1, 'name': ('like', '%%%s%%' % txt)},
			fields=['name']
		)
	# def get_filtered_hd_agents(txt):
    # Your custom query to fetch filtered HD Agents
		