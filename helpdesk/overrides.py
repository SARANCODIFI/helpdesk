import frappe
import math

def on_assignment_rule_trash(doc, event):
	if not frappe.get_all(
		"Assignment Rule",
		filters={"document_type": "HD Ticket", "name": ["!=", doc.name]},
	):
		frappe.throw("There should atleast be 1 assignment rule for ticket")


@frappe.whitelist(allow_guest = True)
def search_customers(query, branch):
	
    # Validate the query or perform any necessary preprocessing
    query = "%" + query + "%"  # Prepare the query for a SQL LIKE search
    # frappe.errprint(branch)
    # Perform the database query
    customers = frappe.db.sql("""
    SELECT name, customer_name, email_id, mobile_no, fsl_pan_card, fsl_branch_id
    FROM `tabCustomer`
    WHERE (customer_name LIKE %s OR email_id LIKE %s OR name LIKE %s OR mobile_no LIKE %s) 
    AND (fsl_branch_id = %s OR fsl_branch LIKE %s)
""", (query, query, query, query, branch, branch), as_dict=True)

    
    return customers
#  AND  (fsl_branch = %s OR fsl_branch_id = %s)

# @frappe.whitelist()
# def search_customers(query):
#     query = "%" + query + "%"
#     customers = frappe.db.sql("""
#         SELECT name, customer_name, email_id
#         FROM `tabCustomer`
#         WHERE customer_name LIKE %s OR email_id LIKE %s
#         LIMIT 50
#     """, (query, query), as_dict=True)
#     return customers
