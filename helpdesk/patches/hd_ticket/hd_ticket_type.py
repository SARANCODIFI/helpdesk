from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields
from frappe.custom.doctype.property_setter.property_setter import make_property_setter

########## Old Patch ###########
def execute():
    custom_field = {
        "HD Ticket Type": [
            dict(
                fieldname = "fsl_tat_in_hours",
                fieldtype = "Duration",
                label = "TAT in Hours",
                insert_after = "fsl_tat"
            )
        ]
    }
    create_custom_fields(custom_field)
    make_property_setter("HD Ticket Type","fsl_tat","hidden",0,"Check")
    make_property_setter("HD Ticket Type","fsl_tat_in_hours","field_type","Data","Select")
    make_property_setter("HD Ticket Type","fsl_tat_in_hours","read_only",1,"Check")