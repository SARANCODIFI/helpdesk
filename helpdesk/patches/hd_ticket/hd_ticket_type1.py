# Copyright (c) 2023, Frutter Software Labs (P) Ltd and contributors
# For license information, please see license.txt

import frappe
from frappe.custom.doctype.property_setter.property_setter import make_property_setter

def test():
        make_property_setter("HD Ticket Type","fsl_tat_in_hours","read_only",0,"Check")
        make_property_setter("HD Ticket Type","fsl_major_category","hidden",1,"Check")