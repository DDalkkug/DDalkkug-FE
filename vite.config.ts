import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),

    Components({
      dts: "src/components.d.ts",
      resolvers: [
        IconsResolver({
          prefix: "Icon",
          enabledCollections: [
            "mdi",
            "material-symbols",
            "ic",
            "ph",
            "line-md",
          ],
        }),
      ],
    }),

    Icons({
      autoInstall: true,
    }),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    host: "0.0.0.0",
    port: 5173, // 필요시 포트 조정
  },
});
