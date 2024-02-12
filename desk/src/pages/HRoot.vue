<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import {
  // AGENT_PORTAL_LANDING,
  AGENT_PORTAL_AGENT_LIST,
  CUSTOMER_PORTAL_LANDING,
  KB_PUBLIC,
} from "@/router";

const router = useRouter();
const authStore = useAuthStore();
const configStore = useConfigStore();

function getTarget() {
  // if (authStore.hasDeskAccess) return AGENT_PORTAL_LANDING;
  if (authStore.hasDeskAccess) return AGENT_PORTAL_AGENT_LIST;  
  else if (configStore.preferKnowledgeBase) return KB_PUBLIC;
  else return CUSTOMER_PORTAL_LANDING;
}

function getEmployeeDetails() {
  const data = fetch(`https://erp.cholasecurities.com/api/method/helpdesk.helpdesk.doctype.hd_ticket.api.get_employee?email_id=${authStore.userId}`);
  data.then(response => {
    if (response.ok) {
      return response.json();
    }
  })
    .then(data => {
      if (data && data?.message) {
        localStorage.setItem('empDetails', JSON.stringify(data.message))
      }
    }).catch(err => {
      console.log(err, 'err-----------------------');
      
      localStorage.removeItem('empDetails')
    })
}
getEmployeeDetails();

router.push({ name: getTarget() });


</script>
