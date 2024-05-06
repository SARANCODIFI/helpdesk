<template>
    <div class="flex flex-col">
      <PageTitle title="Internal Tickets">
        <template #right>
          <RouterLink :to="{ name: 'TicketAgentNewInternal' }">
            <Button label="New ticket" theme="gray" variant="solid">
              <template #prefix>
                <LucidePlus class="h-4 w-4" />
              </template>
            </Button>
          </RouterLink>
        </template>
      </PageTitle>
      <div class="mx-5 mt-2.5 flex items-center justify-between">
        <PresetFilters doctype="HD Ticket" />
        <div class="flex items-center gap-2">
          <FilterPopover doctype="HD Ticket" />
          <Dropdown :options="sortOptions">
            <template #default>
              <Button :label="getOrder() || 'Sort'" variant="outline" size="sm">
                <template #prefix>
                  <LucideArrowDownUp class="h-4 w-4" />
                </template>
              </Button>
            </template>
          </Dropdown>
          <ColumnSelector doctype="HD Ticket" :columns="columns" />
        </div>
      </div>
      <TicketsAgentListInternal :resource="findIsBranchEmp() ? employeeTickets : findIsBranchCare() ? branchTickets : internalTickets" :columns="columns" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, onMounted } from "vue";
  import { createResource, usePageMeta, Button, Dropdown } from "frappe-ui";
  import { AGENT_PORTAL_TICKET_INTERNAL } from "@/router";
  import { socket } from "@/socket";
  import { useAuthStore } from "@/stores/auth";
  import { useFilter } from "@/composables/filter";
  import { useOrder } from "@/composables/order";
  import { createListManager } from "@/composables/listManager";
  import PageTitle from "@/components/PageTitle.vue";
  import { ColumnSelector, FilterPopover } from "@/components";
  import TicketsAgentListInternal from "./TicketsAgentListInternal.vue";
  import PresetFilters from "./PresetFilters.vue";
  const authStore = useAuthStore();
  const { userId } = useAuthStore();
  const { getArgs } = useFilter("HD Ticket");
  const { get: getOrder, set: setOrder } = useOrder();
  const pageLength = ref(20);
  let employeeMailId = ref("");
  let employeeDetails = ref();
  const tickets = createListManager({
    doctype: "HD Ticket",
    pageLength: pageLength.value,
    filters: getArgs(),
    orderBy: getOrder(),
    auto: true,
    transform: (data) => {
      for (const d of data) {
        d.class = {
          "font-medium": !d._seen?.includes(userId),
        };
        d.onClick = {
          name: AGENT_PORTAL_TICKET_INTERNAL,
          params: {
            ticketId: d.name,
          },
        };
        d.conversation = {
          incoming: d.count_msg_incoming,
          outgoing: d.count_msg_outgoing,
          comments: d.count_comment,
        };
        d.source = d.via_customer_portal ? "Customer portal" : "Email";
      }
      return data;
    },
  });

  const internalTickets = computed(() => {
    let filteredTickets = (tickets?.data as Array<any>)?.filter((el: any) => {
        let empName = employeeDetails.value?.data?.emp_name;
        let empId = employeeDetails.value?.data?.emp_id;
        el.fsl_customer_name = empName;
        el.customer = empId;
        return el.fsl_internal_ticket == 1;
    });
    tickets.data = filteredTickets;

    return tickets;
});

  const employeeTickets = computed(() => {
    let filteredTickets = tickets?.data?.filter((el: any) => {
      let empName = employeeDetails.value?.data?.emp_name
      let empId = employeeDetails.value?.data?.emp_id
      el.fsl_customer_name = empName
      el.customer = empId
      return el.owner == userId && el.fsl_internal_ticket == 1
    });
    tickets.data = filteredTickets
    return tickets
  });

  const branchTickets = computed(() => {
  if (localStorage.getItem('empDetails')) {
    let branch = JSON.parse(localStorage.getItem('empDetails')).emp_branch
    let filteredTickets = tickets?.data?.filter((el: any) => {
      let empName = employeeDetails.value?.data?.emp_name
      let empId = employeeDetails.value?.data?.emp_id
      el.fsl_customer_name = empName
      el.customer = empId
      return el.fsl_branch_id == branch && el.fsl_internal_ticket == 1
    });
    tickets.data = filteredTickets
  }
  return tickets
});
  
  const sortOptionsRes = createResource({
    url: "helpdesk.extends.doc.sort_options",
    auto: true,
    params: {
      doctype: "HD Ticket",
    },
  });
  const sortOptions = computed(() => {
    return sortOptionsRes.data?.map((o) => ({
      label: o,
      onClick: () => setOrder(o),
    }));
  });
  
  socket.on("helpdesk:new-ticket", () => {
    if (!tickets.hasPreviousPage) tickets.reload();
  });
  
  let columns = [
    {
      label: "#",
      key: "name",
      width: "w-10",
      text: "text-sm",
    },
    {
      label: "Employee ID",
      key: "customer",
      width: "w-32",
    },
    {
      label: "Employee Name",
      key: "fsl_customer_name",
      width: "w-36",
    },
    {
      label: "Subject",
      key: "subject",
      width: "w-96",
      text: "text-gray-900",
    },
    {
      label: "Status",
      key: "status",
      width: "w-20",
    },
    {
      label: "Priority",
      key: "priority",
      width: "w-32",
    },
    {
      label: "Query Type",
      key: "fsl_query_type",
      width: "w-56",
      // text: "text-gray-900",
    },
    {
      label: "Call Type",
      key: "fsl_call_type",
      width: "w-56",
      // text: "text-gray-900",
    },
    {
      label: "Sub Call Type",
      key: "ticket_type",
      width: "w-56",
    },
    {
      label: "Team",
      key: "agent_group",
      width: "w-36",
    },
    {
      label: "Contact",
      key: "contact",
      width: "w-36",
    },
    {
      label: "Agreement status",
      key: "agreement_status",
      width: "w-36",
    },
    {
      label: "First response",
      key: "response_by",
      width: "w-32",
    },
    {
      label: "Resolution",
      key: "resolution_by",
      width: "w-32",
    },
    {
      label: "Source",
      key: "fsl_source",
      width: "w-36",
    },
    {
      label: "Assignee",
      key: "assignee",
      width: "w-40",
    },
    {
      label: "Conversation",
      key: "conversation",
      width: "w-28",
    },
    {
      label: "Last modified",
      key: "modified",
      width: "w-32",
    },
    {
      label: "Created",
      key: "creation",
      width: "w-36",
    },
  ];

  usePageMeta(() => {
    return {
      title: "Internal Tickets",
    };
  });

  function getEmployeeDetails() {
    let data = createResource({
      url: `helpdesk.helpdesk.doctype.hd_ticket.api.get_employee?email_id=${authStore.userId}`,
      auto: true,
    });
    employeeDetails.value = data
    // let empName = employeeDetails.value?.data?.emp_name
    // let empId = employeeDetails.value?.data?.emp_id
  }

  onMounted(() => {
    // let userMailId = localStorage.getItem('userMailId')
    if (authStore.userId) {
      employeeMailId.value = authStore.userId
    }
    getEmployeeDetails();
  })

function findIsBranchEmp() {
  if(localStorage.getItem('empDetails')) {
    let roles = JSON.parse(localStorage.getItem('empDetails')).emp_roles
    let isBranchEmployee: any;
    if(roles?.length) {
      isBranchEmployee = roles.includes('Branch Employee')
    }
    return isBranchEmployee
  }
  return false
}

function findIsBranchCare() {
  if(localStorage.getItem('empDetails')) {
    let roles = JSON.parse(localStorage.getItem('empDetails')).emp_roles
    let isBranchCare: any;
    if(roles?.length) {
      isBranchCare = roles.includes('Branch Care')
    }
    return isBranchCare
  }
  return false
}

  </script>
  