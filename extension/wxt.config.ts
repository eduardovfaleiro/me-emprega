import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "me emprega",
    description: "Automatize suas candidaturas de emprego",
    permissions: ["activeTab", "scripting"],
    host_permissions: ["<all_urls>"],
    action: {
      default_title: "me emprega",
    },
  },
});
