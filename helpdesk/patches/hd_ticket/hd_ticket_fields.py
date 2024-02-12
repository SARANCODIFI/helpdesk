# from __future__ import unicode_literals
# import frappe
# from frappe import _
# from frappe.custom.doctype.custom_field.custom_field import create_custom_fields
# from frappe.custom.doctype.property_setter.property_setter import make_property_setter

# def custom_execute():
#     custom_field = {
#         "HD Ticket": [

#             dict(
#                 fieldname = "fsl_query_type",
#                 fieldtype = "Link",
#                 label = "Query Type",
#                 options = "Query Type",
#                 insert_after = "cb00"
#             ),
#             dict(
#                 fieldname = "fsl_first_response_time_in_hours",
#                 fieldtype = "Data",
#                 label = "First Response Time in Hours",
#                 hidden  = 1,
#                 insert_after = "first_response_time"
#             ),
#             dict(
#                 fieldname = "fsl_source",
#                 fieldtype = "Select",
#                 label = "Source",
#                 options = "Web\nMobile\nMail\nAgent\nPortal",
#             ),
#             dict(
#                 fieldname = "fsl_through_branch",
#                 fieldtype = "Check",
#                 label = "Through Branch",
#                 insert_after = "fsl_internal_ticket"
#             ),
#             dict(
#                 fieldname = "fsl_branch_id",
#                 fieldtype = "Data",
#                 label = "Branch",
#                 fetch_from = "customer.fsl_branch",
#                 insert_after = "fsl_customer_name",
#                 hidden = 1
#             ),
#             dict(
#                 fieldname = "fsl_call_type",
#                 fieldtype = "Link",
#                 label = "Call Type",
#                 options = "Call Type",
#                 insert_after = "raised_by"
#             ),
#             dict(
#                 fieldname = "fsl_customer_name",
#                 fieldtype = "Data",
#                 label = "Customer Name",
#                 fetch_from = "customer.customer_name",
#                 insert_after = "customer"
#             ),
#             dict(
#                 fieldname = "fsl_column_break1",
#                 fieldtype = "Column Break",
#                 label = "",
#                 insert_after = "fsl_source"
#             ),
#             dict(
#                 fieldname = "fsl_internal_ticket",
#                 fieldtype = "Check",
#                 label = "Internal Ticket",
#                 insert_after = "fsl_column_break1"
#             ),
#             dict(
#                 fieldname = "fsl_employee_id",
#                 fieldtype = "Link",
#                 label = "Employee ID",
#                 options = "Employee",
#                 insert_after = "fsl_customer_name",
#                 depends_on = "eval: doc.fsl_internal_ticket == '1'"
#             ),
#             dict(
#                 fieldname = "fsl_employee_name",
#                 fieldtype = "Data",
#                 label = "Employee Name",
#                 fetch_from = "fsl_employee_id.employee_name",
#                 insert_after = "fsl_employee_id",
#                 depends_on = "eval: doc.fsl_internal_ticket == '1'"
#             ),
#             dict(
#                 fieldname = "fsl_employee_emailid",
#                 fieldtype = "Data",
#                 label = "Employee E-mail ID",
#                 fetch_from = "fsl_employee_id.user_id",
#                 insert_after = "fsl_employee_name",
#                 depends_on = "eval: doc.fsl_internal_ticket == '1'"
#             ),
#              dict(
#                 fieldname = "fsl_tat_in_hours",
#       3          fieldtype = "Duration",
#                 label = "TAT in Hours",
#                 insert_after = "feedback_extra"
#             )
#         ]
#     }
#     create_custom_fields(custom_field)

#     make_property_setter("HD Ticket","status","options","Open\nReplied\nResolved\nClosed\nCancel\nIn-Progress\nClosed - Duplicate","Small Text")
#     make_property_setter("HD Ticket","first_response_time","fetch_from","ticket_type.fsl_tat_in_hours","Small Text")
#     make_property_setter("HD Ticket","fsl_first_response_time_in_hours","hidden",1,"Check")
#     make_property_setter("HD Ticket", "customer", "depends_on", "eval: doc.fsl_internal_ticket != '1'", "Code")
#     make_property_setter("HD Ticket", "fsl_customer_name", "depends_on", "eval:doc.fsl_internal_ticket != '1'", "Code")
#     make_property_setter("HD Ticket", "email_account", "depends_on", "eval: doc.fsl_internal_ticket != '1'", "Code")
   