import frappe
from frappe.custom.doctype.property_setter.property_setter import make_property_setter

def execute():
    make_property_setter("HD Ticket", "customer", "options", "Customer", "Small Text")