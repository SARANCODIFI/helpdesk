from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields
from frappe.custom.doctype.property_setter.property_setter import make_property_setter

def custom_execute():
    custom_field = {
        "HD Ticket": [
            dict(
                fieldname = "fsl_branch_id",
                fieldtype = "Data",
                label = "Branch",
                insert_after = "fsl_customer_name",
                hidden = 1
            ),
        ]
    }
    create_custom_fields(custom_field)
