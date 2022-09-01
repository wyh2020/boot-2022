import { defineConfig } from 'dumi';

const repo = 'boot-2022'; // 项目名

const logo =
  'https://p3-aio.ecombdimg.com/obj/ecom-shop-material/BpZmdeZY_m_f329241fff9101eae6511d649a5f700b_sx_458905_www784-784';

export default defineConfig({
  title: 'wyh-boot',
  mode: 'site',
  locales: [['zh-CN', '中文']],
  favicon: logo,
  logo,
  // more config: https://d.umijs.org/config
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
});
