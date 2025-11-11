import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin to handle @/ imports in mobile-version files
const mobileAliasPlugin = () => ({
  name: 'mobile-alias',
  resolveId(id: string, importer?: string) {
    if (id.startsWith('@/') && importer?.includes('mobile-version')) {
      const mobilePath = path.resolve(__dirname, "./mobile-version/src", id.replace('@/', ''));
      return mobilePath;
    }
    return null;
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mobileAliasPlugin(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@mobile": path.resolve(__dirname, "./mobile-version/src"),
    },
  },
}));
