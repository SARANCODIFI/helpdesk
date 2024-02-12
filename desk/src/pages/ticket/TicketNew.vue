<template>
  <div class="flex flex-col">
    <TicketBreadcrumbs :parent="route.meta.parent" title="New" />
    <div v-if="template.data?.about" class="mx-5 my-3">
      <div class="prose-f" v-html="sanitize(template.data.about)" />
    </div>
    <div class="grid grid-cols-1 gap-4 px-5 sm:grid-cols-3">
      <UniInput v-for="field in visibleFields" :key="field.fieldname" :field="field"
        :value="templateFields[field.fieldname]" @change="templateFields[field.fieldname] = $event.value" />
    </div>
    <!-- <div v-for="o in options" :key="o.field" class="flex flex-col gap-1 m-5">
        <div class="text-xs text-gray-600">
          {{ o.label }}
        </div>
        <Autocomplete
          :options="o.store.dropdown"
          :placeholder="`Select a ${o.label}`"
          v-model="dropModel"
          @change="update(o.field, $event.value, o.store.dropdown)"
        />
      </div> -->
    <div class="flex w-full">
      <div class="w-[80%]">
        <!-- <div v-for="o in customer_option" :key="o.field" class="flex flex-col gap-1 m-5">
          <div class="text-xs text-gray-600">
            {{ o.label }}
          </div>
          <Autocomplete :options="o.store.dropdown" :placeholder="`Select ${o.label}`" v-model="customer"
            @change="update(o.field, $event.value, o.store.dropdown)" />
        </div> -->
         <div class="flex gap-2 items-center m-5">
            <input id="isThroughBranchCB" type="checkbox" v-model="isThroughBranch" class="rounded-[4px] focus:outline-none">
            <label for="isThroughBranchCB" class="text-xs text-gray-600">Through Branch</label>
          </div>
  

        <div class="flex flex-col gap-1 m-5">
          <div class="text-xs text-gray-600">
            Customer
          </div>
          <div class="relative">
            <TextInput v-model="customer" :type="'text'" size="sm" variant="subtle" placeholder="Enter Customer UCC, Name, Phone, or Email to Search & Select a Customer" :disabled="false"
             />
            <ul v-if="dropdownlist.length && isDropdown" class="absolute w-full max-h-[250px] bg-white overflow-y-auto shadow-md rounded p-2 z-10">
              <li @click="update(i)" v-for="(i,id) in dropdownlist" class="py-2 text-xs hover:bg-grey-50 cursor-pointer">{{ i.name+"-"+i.customer_name+"-"+i.mobile_no+"-"+i.email_id }}</li>
            </ul>
          </div>
        </div>

        <div v-for="o in fsl_query_type_option" :key="o.field" class="flex flex-col gap-1 m-5">
          <div class="text-xs text-gray-600">
            {{ o.label }}
          </div>
          <Autocomplete :options="o.store.dropdown" :placeholder="`Select a ${o.label}`" v-model="fsl_query_type" />
        </div>

        <div v-for="o in fsl_call_type_option" :key="o.field" class="flex flex-col gap-1 m-5">
          <div class="text-xs text-gray-600">
            {{ o.label }}
          </div>
          <Autocomplete :options="o.store.dropdown" :placeholder="`Select a ${o.label}`" v-model="fsl_call_type" />
        </div>

        <div v-for="o in ticket_type_option" class="flex flex-col gap-1 m-5">
          <div class="text-xs text-gray-600">
            {{ o.label }}
          </div>
          <!-- :options="o.store.dropdown" -->
          <Autocomplete :options="filerData(o)" :placeholder="`Select a ${o.label}`" v-model="ticket_type" />
        </div>

        <div class="flex flex-col gap-1 m-5">
          <div class="text-xs text-gray-600">
            Created by
          </div>
          <div class="relative">
            <TextInput v-model="createdBy" :type="'text'" size="sm" variant="subtle" :disabled="true"
             />
            <!-- <ul v-if="dropdownlist.length && isDropdown" class="absolute w-full max-h-[250px] bg-white overflow-y-auto shadow-md rounded p-2 z-10">
              <li @click="update(i)" v-for="(i,id) in dropdownlist" class="py-2 text-xs hover:bg-grey-50 cursor-pointer">{{ i.name+"-"+i.customer_name+"-"+i.mobile_no+"-"+i.email_id }}</li>
            </ul> -->
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 p-5">
        <div class="flex flex-col gap-1">
          <div class="text-xs text-gray-600">Customer Name</div>
          <div class="font-medium text-gray-800">{{ cus_contact_info?.customer_name }}</div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs text-gray-600">Mobile No</div>
          <div class="font-medium text-gray-800">{{ cus_contact_info?.mobile_no }}</div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs text-gray-600">Email ID</div>
          <div class="font-medium text-gray-800">{{ cus_contact_info?.email_id }}</div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs text-gray-600">PAN No</div>
          <div class="font-medium text-gray-800">{{ cus_contact_info?.fsl_pan_card }}</div>
        </div>
      </div>
    </div>
    <div class="m-5">
      <FormControl v-model="subject" type="text" label="Subject" placeholder="A short description" />
      <!-- <FormControl
        v-model="fsl_call_type"
        type="text"
        label="Call Type"
        placeholder="Select Call Type"
      />
      <FormControl
        v-model="ticket_type"
        type="text"
        label="Sub Call type"
        placeholder="Select Sub Call Type"
      /> -->
    </div>
    <TicketNewArticles :search="subject" class="mx-5 mb-5" />
    <span class="mx-5 mb-5">
      <TicketTextEditor ref="editor" v-model:attachments="attachments" v-model:content="description"
        placeholder="Detailed explanation" expand>
        <template #bottom-right>
          <Button label="Submit" theme="gray" variant="solid" :disabled="$refs.editor.editor.isEmpty || ticket.loading || !subject || !customer
            " @click="() => ticket.submit()" />
        </template>
      </TicketTextEditor>
    </span>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createResource, usePageMeta, Button, FormControl, Autocomplete, TextInput } from "frappe-ui";
import sanitizeHtml from "sanitize-html";
import { isEmpty } from "lodash";
import { useError } from "@/composables/error";
import { UniInput } from "@/components";
import TicketBreadcrumbs from "./TicketBreadcrumbs.vue";
import TicketNewArticles from "./TicketNewArticles.vue";
import TicketTextEditor from "./TicketTextEditor.vue";
import { useCustomer } from "@/stores/customer";
import { useCallType } from "@/stores/CallType";
import { usequeryType } from "@/stores/queryType";
import { useTicketTypeStore } from "@/stores/ticketType";
import { useAuthStore } from "@/stores/auth";
//import { ITicket } from "./symbols";
// import TiceketNewSideBar from "./TicketNewSidebar.vue";

interface P {
  templateId?: string;
}

const authStore = useAuthStore();
// const options = computed(() => [
//   {
//     field: "fsl_call_type",
//     label: "Call Type",
//     store: useCallType(),
//   },
//   {
//     field: "ticket_type",
//     label: "Sub Call Type",
//     store: useSubCallType(),
//   },
// ]);

const customer_option = computed(() => [
  {
    field: "customer",
    label: "Customer",
    store: useCustomer(),
  }])

const fsl_call_type_option = computed(() => [
  {
    field: "fsl_call_type",
    label: "Call Type",
    store: useCallType(),
  }])
const fsl_query_type_option = computed(() => [
  {
    field: "fsl_query_type",
    label: "Query Type",
    store: usequeryType(),
  }])
const ticket_type_option = computed(() => [
  {
    field: "ticket_type",
    label: "Sub Call Type",
    store: useTicketTypeStore(),
  }])

const props = withDefaults(defineProps<P>(), {
  templateId: "",
});
const route = useRoute();
const router = useRouter();
const subject = ref("");
const customer = ref("");
const fsl_call_type = ref("");
const fsl_query_type = ref("");
const ticket_type = ref("");
const description = ref("");
const attachments = ref([]);
const templateFields = reactive({});

let employeeMailId = ref("")
let employeeDetails = ref()


let cus_contact_info = ref({
  customer_name: '',
  mobile_no: '',
  fsl_pan_card: '',
  email_id: ''
})
let dropdownlist = ref([])
let isDropdown = ref(true)
let isSubmited = ref(false)
let createdBy = ref()
let isThroughBranch = ref()

const template = createResource({
  url: "helpdesk.helpdesk.doctype.hd_ticket_template.api.get_one",
  makeParams: () => ({
    name: props.templateId || "Default",
  }),
  auto: true,
});

const visibleFields = computed(() =>
  template.data?.fields.filter((f: { hide_from_customer: any; }) => route.meta.agent || !f.hide_from_customer)
);


function getEmpBranch() {
  let empbranch = ''
  if(localStorage.getItem('empDetails')) {
    empbranch = JSON.parse(localStorage.getItem('empDetails'))?.emp_branch;
  }
  return empbranch;
}

const ticket = createResource({
  url: "helpdesk.helpdesk.doctype.hd_ticket.api.new",
  debounce: 300,
  makeParams: () => ({
    doc: {
      fsl_through_branch: isThroughBranch?.value ? 1 : 0,
      fsl_internal_ticket: 0,
      fsl_branch_id: getEmpBranch(),
      description: description.value,
      subject: subject.value,
      customer: customer.value,
      fsl_call_type: fsl_call_type.value['value'],
      fsl_query_type: fsl_query_type.value['value'],
      ticket_type: ticket_type.value['value'],
      template: props.templateId,
      ...templateFields,
    },
    attachments: attachments.value,
  }),
  validate: (params: { doc: { [x: string]: any; }; }) => {
    const fields = visibleFields.value.filter((f: { required: any; }) => f.required);
    const toVerify = [...fields, "subject", "description"];
    for (const field of toVerify) {
      if (isEmpty(params.doc[field.fieldname || field])) {
        return `${field.label || field} is required`;
      }
    }
  },
  onSuccess: (data: { name: any; }) => {
    router.push({
      name: route.meta.onSuccessRoute as string,
      params: {
        ticketId: data.name,
      },
    });
  },
  onError: useError(),
});

function sanitize(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  });
}

usePageMeta(() => ({
  title: "New Ticket",
}));

watch(customer, (newcustomer: any) => {
  dropdownlist.value = []
  getCustomers(newcustomer)
});

watch(fsl_call_type, (new_fsl_call_type:any, old_fsl_call_type) => {
    if(new_fsl_call_type.value != old_fsl_call_type.value) {
      ticket_type.value = ''
    }
  })

function filerData(storeData: any) {
  return storeData.store.dropdown.filter((d: any) => d?.fsl_call_type == fsl_call_type.value['value']);
}

async function getCustomers(customer) {
  isDropdown.value = true
  if (customer.length > 2) {
    // let userMailId = localStorage.getItem('userMailId')
    // if (userMailId) {
    //   employeeMailId.value = userMailId
    // }
    // await getEmployeeDetails();

    let search = customer
    const currentDomain = window.location.origin;
    const data = fetch(`${currentDomain}/api/method/helpdesk.overrides.search_customers?query=${search}&branch=${employeeDetails.value?.data?.emp_branch}`);
    // &branch=${employeeDetails.value?.data?.emp_branch}`);
   
    
    data.then(response => {
      if (response.ok) {
        return response.json();
      }
    })
      .then(data => {
        if (data.message?.length) {
          dropdownlist.value = data.message
        }
      })
  }
  
}



async function getEmployeeDetails() {
    let data = createResource({
      url: `helpdesk.helpdesk.doctype.hd_ticket.api.get_employee?email_id=${authStore.userId}`,
      auto: true,
    });
    employeeDetails.value = data
    const empBranch = employeeDetails.value?.data?.emp_branch;
  }



function update(data:any) {
  isDropdown.value = false
  customer.value = data?.name
  cus_contact_info = data
}

function validateForm() {
  return customer.value != ''
}

async function onSubmit(ticket:any) {
  isSubmited.value = true
  if(validateForm) {
    await ticket.submit()
    isSubmited.value = false
  }
} 

onMounted(() => {
    let userMailId = localStorage.getItem('userMailId')
    if (userMailId) {
      createdBy.value = userMailId
      employeeMailId.value = userMailId
    }
    getEmployeeDetails();
  })

</script>
