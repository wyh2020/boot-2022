import { defineConfig } from 'dumi';

const repo = 'boot-2022'; // 项目名

export default defineConfig({
  title: 'wyh-boot',
  mode: 'site',
  favicon: '/images/logo.png',
  logo: '/images/logo.png',
  // more config: https://d.umijs.org/config
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
});
