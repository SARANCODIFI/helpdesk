# Copyright (c) 2023, Frutter Software Labs (P) Ltd and contributors
# For license information, please see license.txt

import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields
from frappe.custom.doctype.property_setter.property_setter import make_property_setter


################### Old Patch #####################
def execute():
    custom_field = {
        "HD Ticket": [
            
            dict(
                fieldname = "fsl_call_type",
                fieldtype = "Link",
                label = "Call Type",
                options = "Call Type",
                insert_after = "raised_by"
            ),
            dict(
                fieldname = "fsl_customer_name",
                fieldtype = "Data",
                label = "Customer Name",
                fetch_from = "customer.customer_name",
                insert_after = "customer"
            ),
            dict(
                fieldname = "fsl_column_break1",
                fieldtype = "Column Break",
                label = "",
                insert_after = "fsl_source"
            ),
            dict(
                fieldname = "fsl_internal_ticket",
                fieldtype = "Check",
                label = "Internal Ticket",
                insert_after = "fsl_column_break1"
            ),
            dict(
                fieldname = "fsl_employee_id",
                fieldtype = "Link",
                label = "Employee ID",
                options = "Employee",
                insert_after = "fsl_customer_name",
                depends_on = "eval: doc.fsl_internal_ticket == '1'"
            ),
            dict(
                fieldname = "fsl_employee_name",
                fieldtype = "Data",
                label = "Employee Name",
                fetch_from = "fsl_employee_id.employee_name",
                insert_after = "fsl_employee_id",
                depends_on = "eval: doc.fsl_internal_ticket == '1'"
            ),
            dict(
                fieldname = "fsl_employee_emailid",
                fieldtype = "Data",
                label = "Employee E-mail ID",
                fetch_from = "fsl_employee_id.user_id",
                insert_after = "fsl_employee_name",
                depends_on = "eval: doc.fsl_internal_ticket == '1'"
            ),
        ]
    }
    
    create_custom_fields(custom_field)

    make_property_setter("HD Ticket", "customer", "depends_on", "eval: doc.fsl_internal_ticket != '1'", "Code")
    make_property_setter("HD Ticket", "fsl_customer_name", "depends_on", "eval:doc.fsl_internal_ticket != '1'", "Code")
    make_property_setter("HD Ticket", "email_account", "depends_on", "eval: doc.fsl_internal_ticket != '1'", "Code")