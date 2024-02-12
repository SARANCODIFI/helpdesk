import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useTicketStatusStore = defineStore("ticketStatus", () => {
  const options = ref(["Open", "Replied", "Resolved", "Closed", "Cancel", "In-Progress", "Closed - Duplicate"]);
  const dropdown = computed(() =>
    options.value.map((o) => ({
      label: o,
      value: o,
    }))
  );
  const colorMap = {
    Open: "red",
    Replied: "blue",
    Resolved: "green",
    Closed: "gray",
    Cancel: "orange",
    "In-Progress": "blue",
    "Closed - Duplicate" :"gray"
  };
  const stateActive = ["Open", "Replied", "In-Progress"];
  const stateInactive = ["Resolved", "Closed","Cancel","Closed - Duplicate"];

  return {
    colorMap,
    dropdown,
    options,
    stateActive,
    stateInactive,
  };
});
