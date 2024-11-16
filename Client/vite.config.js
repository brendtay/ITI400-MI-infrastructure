import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { config as loadEnv } from 'dotenv'

// Load .env file
loadEnv();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
