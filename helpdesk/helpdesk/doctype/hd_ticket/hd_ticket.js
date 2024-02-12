// Copyright (c) 2024, Frappe Technologies and contributors
// For license information, please see license.txt
import frappe from "frappe";
const __ = frappe.__;

frappe.ui.form.on("HD Ticket", {
  refresh: function (frm, cdt, cdn) {
    var hasPartnerRole = frappe.user.has_role("Partner");
    var hasRmRole = frappe.user.has_role("RM");

    if (frappe.user.has_role("Admin")) {
      console.log();
    } else if (hasPartnerRole || hasRmRole) {
      frappe.call({
        method: "helpdesk.helpdesk.doctype.hd_ticket.api.get_employee",
        args: {
          email_id: frappe.session.user,
        },
        callback: function (response) {
          if (response.message) {
            var branch = response.message.emp_branch;
            frm.set_query("customer", function () {
              return {
                filters: {
                  fsl_branch_id: branch,
                },
              };
            });
          } else {
            console.error("Error in get_employee method:", response.error);
          }
        },
      });
    }

    if (frm.doc.__islocal) {
      frm.set_df_property("status", "read_only", 1);
      frm.refresh_fields("status");
      frm.set_df_property("fsl_assign_to", "hidden", 1);
      frm.refresh_fields("fsl_assign_to");

      const role = frappe.user.has_role("RM")
        ? "RM"
        : frappe.user.has_role("Partner")
        ? "Partner"
        : null;

      if (role) {
        frappe.call({
          method: "helpdesk.helpdesk.doctype.hd_ticket.api.get_employee",
          args: { email_id: frappe.session.user },
          callback: function (response) {
            if (response.message) {
              frm.set_value("fsl_source", role);
              frm.set_value("fsl_branch_id", response.message.emp_branch);
              frm.set_df_property("fsl_source", "read_only", 1);
              frm.set_df_property("fsl_branch_id", "read_only", 1);
            } else {
              console.error("Error in your_custom_method:", response.error);
            }
          },
        });
      }
    } else {
      frm.set_df_property("fsl_source", "read_only", 1);

      frm.set_df_property("fsl_assign_to", "hidden", 0);

      frm.set_df_property("fsl_internal_ticket", "read_only", 1);

      frm.refresh_fields("fsl_internal_ticket");

      frm.set_df_property("fsl_through_branch", "read_only", 1);

      frm.set_df_property("customer", "read_only", 1);

      frm.set_df_property("fsl_customer_name", "read_only", 1);

      frm.set_df_property("employee", "read_only", 1);

      frm.set_df_property("fsl_employee_name", "read_only", 1);

      frm.set_df_property("agent_group", "read_only", 0);

      frm.add_custom_button(__("Assign to"), function () {
        frappe.prompt(
          [
            {
              fieldname: "users",
              fieldtype: "MultiSelectPills",
              options: "HD Agent",
              label: __("Assign to"),
              reqd: true,

              get_data: function (txt) {
                return frappe.db.get_link_options("HD Agent", txt);
              },
            },
          ],
          function (values) {
            values.users.forEach(function (user) {
              frappe.call({
                method: "frappe.share.add",
                args: {
                  doctype: frm.doc.doctype,
                  name: frm.doc.name,
                  user: user,
                  read: 1,
                  write: 1,
                  share: 1,
                },
                callback: function () {
                  frappe.call({
                    method: "frappe.desk.form.assign_to.add",
                    args: {
                      assign_to: [user],
                      doctype: frm.doc.doctype,
                      name: frm.doc.name,
                      description: "description",
                    },
                    callback: function () {
                      frm.refresh();
                    },
                  });
                  frm.doc.refresh();
                },
              });
            });
            frappe.msgprint(__("Document assigned to that Employee"));
          },
          __("Assign to"),
          "Submit"
        );
      });

      if (frm.doc.status == "Open") {
        frm.add_custom_button(__("Create Child Ticket"), function () {
          let d = new frappe.ui.Dialog({
            title: "Before Enter details Please Save the Doctype",

            fields: [
              {
                label: "Source",
                fieldname: "ticket_source",
                fieldtype: "Select",
                options: "Web\nMobile\nMail\nAgent\nPortal\nRM",
                reqd: 1,
              },
              {
                label: "Subject",
                fieldname: "subject",
                fieldtype: "Data",
                reqd: 1,
              },
              {
                label: "Query Type",
                fieldname: "fsl_query_type",
                fieldtype: "Link",
                options: "Query Type",
                reqd: 1,
              },
              {
                label: "Call Type",
                fieldname: "call_type",
                fieldtype: "Link",
                options: "Call Type",
                reqd: 1,
                onchange: function () {
                  let callType = d.get_value("call_type");
                  d.fields_dict["ticket_type"].get_query = function () {
                    return {
                      filters: { fsl_call_type: callType },
                    };
                  };
                },
              },
              {
                label: "Sub Call Type",
                fieldname: "ticket_type",
                fieldtype: "Link",
                options: "HD Ticket Type",
                reqd: 1,
              },
            ],

            size: "small", // small, large, extra-large
            primary_action_label: "Submit",

            primary_action(values) {
              frappe.call({
                method: "helpdesk.child_ticket.create_ticket",
                args: {
                  parent: frm.doc.name,
                  source: values.ticket_source,
                  subject: values.subject,
                  query_type: values.fsl_query_type,
                  call_type: values.call_type,
                  ticket_type: values.ticket_type,
                },
                callback: function (r, cdt, cdn) {
                  var new_row = {
                    ticket_id: r.message[0],
                    status: r.message[1],
                    call_type: r.message[2],
                    ticket_typesub_call_type: r.message[3],
                  };
                  frm.doc.hd_child_tickets.push(new_row);
                  frappe.show_alert({
                    message: __("Child Ticket Created Successfully"),
                    indicator: "green",
                  });
                  frm.refresh_field("hd_child_tickets");
                },
              });
              d.hide();
            },
          });

          d.show();
        });
      }
    }

    if (frm.doc.agent_group) {
      frappe.db.get_doc("HD Team", frm.doc.agent_group).then((doc) => {
        let jsonArray = doc.users;
        var stringArray = jsonArray.map(function (item) {
          return item.user;
        });
        frm.set_df_property("fsl_assign_to", "options", stringArray);
      });
    }

    frm.add_custom_button(__("Go to Customer 360"), function () {
      var customer_name = frm.doc.customer;
      if (customer_name) {
        var currentSiteURL = frappe.urllib.get_base_url();
        var url = currentSiteURL + "/app/customer/" + frm.doc.customer;
        window.open(url, "_blank");
      } else {
        frappe.msgprint("Customer not linked.");
      }
    });
  },

  agent_group: function (frm) {
    if (frm.doc.agent_group) {
      frappe.db.get_doc("HD Team", frm.doc.agent_group).then((doc) => {
        let jsonArray = doc.users;
        var stringArray = jsonArray.map(function (item) {
          return item.user;
        });
        frm.set_df_property("fsl_assign_to", "options", stringArray);
      });
    }
  },
  ticket_type: function (frm) {
    if (frm.initial_ticket_type !== frm.doc.ticket_type) {
      if (frm.doc.ticket_type) {
        frappe.call({
          method: "helpdesk.helpdesk.custom.hd_ticket.assign_to",
          args: {
            ticketType: frm.doc.ticket_type,
          },
          callback: function (r) {
            frm.set_value("priority", r.message.priority);
            frm.set_value("agent_group", r.message.agentGroup);
            frm.set_df_property(
              "fsl_assign_to",
              "options",
              r.message.assign_to
            );
            frm.refresh();
          },
        });
      }
    }
  },

  fsl_assign_to: function (frm) {
    var user = frm.doc.fsl_assign_to;

    if (user) {
      frappe.call({
        method: "frappe.share.add",
        args: {
          doctype: frm.doc.doctype,
          name: frm.doc.name,
          user: user,
          read: 1,
          write: 1,
          share: 1,
        },
        callback: function () {
          frappe.call({
            method: "frappe.desk.form.assign_to.add",
            args: {
              assign_to: [user],
              doctype: frm.doc.doctype,
              name: frm.doc.name,
              description: "description",
            },
            callback: function () {
              frm.refresh();
            },
          });
        },
      });
    }
  },
  fsl_internal_ticket: function (frm) {
    if (frm.doc.fsl_internal_ticket) {
      frappe.call({
        method: "helpdesk.helpdesk.doctype.hd_ticket.api.get_employee",
        args: {
          email_id: frappe.session.user,
        },
        callback: function (response) {
          if (response.message) {
            var branch = response.message.emp_branch;
            frm.set_value("fsl_branch_id", branch);
          } else {
            console.error("Error in get_employee method:", response.error);
          }
        },
      });
    } else {
      frm.set_value("fsl_branch_id", "");
    }
  },
  after_save: function (frm) {
    if (frm.doc.fsl_internal_ticket == 1) {
      frm.set_value("ticket_type_user", "Internal Ticket");
    } else {
      frm.set_value("ticket_type_user", "Customer Ticket");
    }
  },

  fsl_call_type: function (frm) {
    frm.set_query("ticket_type", function () {
      return {
        filters: [
          ["HD Ticket Type", "fsl_call_type", "=", frm.doc.fsl_call_type],
        ],
      };
    });
    frm.set_value("ticket_type", "");
    frm.refresh_field("ticket_type");
  },
});
