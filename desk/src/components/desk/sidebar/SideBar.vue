<template>
  <div
    class="z-0 flex select-none flex-col border-r border-gray-200 bg-gray-50 p-2 text-base duration-300 ease-in-out"
    :style="{
      'min-width': width,
      'max-width': width,
    }"
  >
    <UserMenu class="mb-2 ml-0.5" :options="profileSettings" />
    <span class="mb-4">
      <div
        v-if="!isExpanded && notificationStore.unread"
        class="absolute z-20 h-1.5 w-1.5 translate-x-6 translate-y-1 rounded-full bg-gray-800"
        theme="gray"
        variant="solid"
      />
      <SidebarLink
        class="relative"
        label=" Notifications"
        :icon="LucideInbox"
        :on-click="() => notificationStore.toggle()"
        :is-expanded="isExpanded"
      >
        <template #right>
          <Badge
            v-if="isExpanded && notificationStore.unread"
            :label="notificationStore.unread"
            theme="gray"
            variant="subtle"
          />
        </template>
      </SidebarLink>
    </span>
    <div class="mb-4 flex flex-col gap-1">
      <SidebarLink
        v-for="option in menuOptions"
        v-bind="option"
        :key="option.label"
        :is-expanded="isExpanded"
        :is-active="option.to?.includes(route.name.toString())"
        :class="{ hidden: showBasedOnRole(option.label) }"
      />
    </div>
    <div class="flex flex-col gap-1">
      <SidebarLink
        v-for="option in extraOptions.filter((o) => !o.hide)"
        v-bind="option"
        :key="option.label"
        :is-expanded="isExpanded"
        :is-active="option.to?.includes(route.name?.toString())"
      />
    </div>
    <div class="grow" />
    <SidebarLink
      :icon="isExpanded ? LucideArrowLeftFromLine : LucideArrowRightFromLine"
      :is-active="false"
      :is-expanded="isExpanded"
      :label="isExpanded ? 'Collapse' : 'Expand'"
      :on-click="() => (isExpanded = !isExpanded)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useKeymapStore } from "@/stores/keymap";
import { useNotificationStore } from "@/stores/notification";
import { useSidebarStore } from "@/stores/sidebar";
import {
  AGENT_PORTAL_AGENT_LIST,
  AGENT_PORTAL_CANNED_RESPONSE_LIST,
  AGENT_PORTAL_CONTACT_LIST,
  AGENT_PORTAL_CUSTOMER_LIST,
  //AGENT_PORTAL_DASHBOARD,
  AGENT_PORTAL_ESCALATION_RULE_LIST,
  AGENT_PORTAL_TEAM_LIST,
  AGENT_PORTAL_TICKET_LIST,
  AGENT_PORTAL_TICKET_TYPE_LIST,
  CUSTOMER_PORTAL_LANDING,
  AGENT_PORTAL_TICKET_LIST_INTERNAL,
} from "@/router";
import { SidebarLink } from "@/components";
import UserMenu from "./UserMenu.vue";
import LucideArrowUpFromLine from "~icons/lucide/arrow-up-from-line";
import LucideArrowRightFromLine from "~icons/lucide/arrow-right-from-line";
import LucideArrowLeftFromLine from "~icons/lucide/arrow-left-from-line";
import LucideBookOpen from "~icons/lucide/book-open";
import LucideCloudLightning from "~icons/lucide/cloud-lightning";
import LucideContact2 from "~icons/lucide/contact-2";
import LucideFolderOpen from "~icons/lucide/folder-open";
import LucideInbox from "~icons/lucide/inbox";
//import LucideLayoutGrid from "~icons/lucide/layout-grid";
import LucideTicket from "~icons/lucide/ticket";
import LucideUser from "~icons/lucide/user";
import LucideUserCircle2 from "~icons/lucide/user-circle-2";
import LucideUsers from "~icons/lucide/users";
import Home from "~icons/lucide/home";
import Fingerprint from "~icons/lucide/fingerprint";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const keymapStore = useKeymapStore();
const notificationStore = useNotificationStore();
const { isExpanded, width } = storeToRefs(useSidebarStore());

const menuOptions = computed(() => [
  {
    label: "Homepage",
    icon: Home,
    onClick: () => {
      const currentDomain = window.location.origin;
      const link = document.createElement("a");
      link.href = `${currentDomain}/app/helpdesk`;
      link.click();
    },
  },
  {
    label: "Customer 360",
    icon: Fingerprint,
    onClick: () => {
      const currentDomain = window.location.origin;
      const link = document.createElement("a");
      link.href = `${currentDomain}/app/customer`;
      link.target = "_blank";
      link.click();
    },
  },
  {
    label: "Internal Tickets",
    icon: LucideTicket,
    to: AGENT_PORTAL_TICKET_LIST_INTERNAL,
  },
  {
    label: "Customer Tickets",
    icon: LucideTicket,
    to: AGENT_PORTAL_TICKET_LIST,
  },
  // {
  //   label: "Dashboard",
  //   icon: LucideLayoutGrid,
  //   to: AGENT_PORTAL_DASHBOARD,
  // },
  {
    label: "Agents",
    icon: LucideUser,
    to: AGENT_PORTAL_AGENT_LIST,
  },
  {
    label: "Knowledge base",
    icon: LucideBookOpen,
    to: "DeskKBHome",
    isBeta: true,
  },
]);

const extraOptions = [
  {
    label: "Teams",
    icon: LucideUsers,
    to: AGENT_PORTAL_TEAM_LIST,
  },
  {
    label: "Escalation rules",
    icon: LucideArrowUpFromLine,
    to: AGENT_PORTAL_ESCALATION_RULE_LIST,
    isBeta: true,
  },
  {
    label: "Ticket types",
    icon: LucideFolderOpen,
    to: AGENT_PORTAL_TICKET_TYPE_LIST,
    hide: true,
  },
  {
    label: "Canned responses",
    icon: LucideCloudLightning,
    to: AGENT_PORTAL_CANNED_RESPONSE_LIST,
    isBeta: true,
  },
  {
    label: "Customers",
    icon: LucideUserCircle2,
    to: AGENT_PORTAL_CUSTOMER_LIST,
  },
  {
    label: "Contacts",
    icon: LucideContact2,
    to: AGENT_PORTAL_CONTACT_LIST,
  },
];

const profileSettings = [
  {
    label: "Shortcuts",
    icon: "command",
    onClick: () => keymapStore.toggleVisibility(true),
  },
  {
    label: "Customer portal",
    icon: "users",
    onClick: () => {
      const path = router.resolve({ name: CUSTOMER_PORTAL_LANDING });
      window.open(path.href, "_blank");
    },
  },
  {
    label: "Log out",
    icon: "log-out",
    onClick: () => authStore.logout(),
  },
];

function showBasedOnRole(item: any) {
  if (localStorage.getItem("empDetails")) {
    let roles = JSON.parse(localStorage.getItem("empDetails")).emp_roles;
    let isCustomerCare: any;
    let isBranchEmployee: any;
    if (roles?.length) {
      isCustomerCare = roles.includes("Customer Care");
      isBranchEmployee = roles.includes("Branch Employee");
    }
    if (item == "Internal Tickets") {
      return isCustomerCare;
    }
    if (item == "Customer Tickets") {
      return isBranchEmployee;
    }
  }
  return false;
}
</script>
