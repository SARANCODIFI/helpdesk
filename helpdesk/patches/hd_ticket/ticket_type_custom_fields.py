# Copyright (c) 2023, Frutter Software Labs (P) Ltd and contributors
# For license information, please see license.txt

import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields
from frappe.custom.doctype.property_setter.property_setter import make_property_setter

def hd_ticket_type_execute():
    custom_field = {
        "HD Ticket Type": [
            dict(
                fieldname = "fsl_call_type",
                fieldtype = "Link",
                label = "Call Type",
                options = "Call Type",
                insert_after = "priority"
            ),
            dict(
                fieldname = "fsl_tat",
                fieldtype = "Data",
                label = "TAT",
                insert_after = "fsl_call_type"
            ),
            dict(
                fieldname = "fsl_tat_in_hours",
                fieldtype = "Duration",
                label = "TAT in Hours",
                insert_after = "fsl_tat"
            ),
            dict(
                fieldname = "fsl_assigned_to_department",
                fieldtype = "Link",
                label = "Assigned To Department",
                options = "HD Team",
                insert_after = "fsl_major_category"
            )
            
        ]
    }
    create_custom_fields(custom_field)

    make_property_setter("HD Ticket Type","fsl_tat","hidden",0,"Check")
    make_property_setter("HD Ticket Type","fsl_tat_in_hours","field_type","Data","Select")
    make_property_setter("HD Ticket Type","fsl_tat_in_hours","read_only",1,"Check")
    