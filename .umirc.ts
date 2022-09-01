import { defineConfig } from 'dumi';

const repo = 'boot-2022'; // 项目名

export default defineConfig({
  title: 'Site Name',
  mode: 'site',
  // more config: https://d.umijs.org/config
  publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
});
