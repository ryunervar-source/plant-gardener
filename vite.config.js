import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 리포지토리 이름 기준 base 경로.
// 사용자 페이지(username.github.io)나 로컬은 '/' 로 override 가능.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/plant-gardener/',
})
