# 点亮这台主机

浏览器里的电脑装机游戏。落地就是工作台：先点配件，再点插槽，红字灭了才能开机。

公开地址：https://bobizhenkeai.github.io/pc-build-game/

## 怎么玩

- **自由组装优先**：打开就是工作台，没有强制教程关。
- 点配件进入**手持**，再点同类别插槽安装或替换；点「取消」或 Esc 放下。
- 空槽显示类别：CPU / 主板 / 内存 / 显卡 / 电源 / 机箱。
- **开机**是主按钮；**挑战场景**可选（入门办公 / 中档电竞 / 卡预算剪辑）。
- 红色兼容问题会挡住开机；黄色只警告，仍可点亮。

## 本地开发

```bash
npm install
npm test
npm run dev
```

生产构建使用 Vite `base: /pc-build-game/`，预览：

```bash
npm run build
npm run preview
```

然后打开 `http://localhost:4173/pc-build-game/`。

## GitHub Pages

本仓库用 Actions 构建并发布，不走 Vercel / Netlify / Cloudflare。

- 工作流：`.github/workflows/deploy-pages.yml`
- 构建后复制 `index.html` → `404.html`，并写入 `.nojekyll`（SPA 回退）
- 站点路径：`/pc-build-game/`

若第一次部署没有自动挂上 Pages，到仓库 **Settings → Pages → Source** 选 **GitHub Actions**。
