# AGENTS.md — 给 AI 编码代理的操作手册

> 这是一个组件化的 Web 3D 游戏骨架（当前是第三人称军事射击 demo）。
> **动手前先读 [ARCHITECTURE.md](./ARCHITECTURE.md)**（技术结构、原理、能做/不能做、定制配方都在那）。本文件是精简操作规则。

## 技术栈
Vite + TypeScript + Three.js（渲染）+ Rapier/`@dimforge/rapier3d-compat`（物理）+ 自研 Entity-Component 架构。

## 项目地图（改动前先定位到层）
- `public/assets/` — 数据层（模型/贴图/天空）。**换美术只动这里 + 加载路径。**
- `src/engine/` — 通用内核（Entity/Component/EntityManager/FiniteStateMachine/Physics/Input）。**一般不要改，除非新增通用能力。**
- `src/entities/` — 玩法组件（ThirdPersonPlayer / SoldierNPC / UIManager）。**改玩法动这里。**
- `src/util/soldier.ts` — 角色克隆/换色、程序化步枪、枪口火光。
- `src/main.ts` — 组装层：加载资产、造关卡（`buildArena`）、拼实体（`startGame`）、主循环（`loop`）。

## 想改什么 → 改哪里（速查）
| 需求 | 位置 |
|---|---|
| 换人物模型 | `main.ts` `loadAssets()` 的 `Soldier.glb` 路径（需 Mixamo 骨骼；按 `RightHand` 找手骨、按 Idle/Walk/Run 找动画） |
| 换武器 | `util/soldier.ts` `buildRifle()`（程序化→改成 `GLTFLoader` 加载 GLB） |
| 换地面/墙/天空 | `main.ts` `loadAssets()` 的贴图/HDRI 路径 |
| 相机/视角、FP↔TP | `entities/ThirdPersonPlayer.ts` 顶部常量（`TP_DIST`/`TP_PIVOT_Y`/`TP_SIDE`/FOV）+ `toggleMode()` |
| 移动/射速/伤害/弹药 | `ThirdPersonPlayer.ts` 顶部常量（`MAX_SPEED`/`fireRate`/`damage`/`magAmmo`…） |
| 敌人 AI | `SoldierNPC.ts`（`VIEW_DIST`/`SHOOT_RANGE`/`MOVE_SPEED` + idle/chase/shoot/dead 状态机） |
| 关卡布局/敌人数量 | `main.ts` 的 `covers` 数组、`spawns` 数组 |
| **加全新机制** | 新建一个 Component（`entities/XXX.ts`），在 `main.ts` 装到实体上——**不改现有文件** |

## 必须遵守的约定
1. **保持三层分离**：美术=资产文件；表现=渲染/相机；逻辑=组件。别把三者揉在一个文件里。
2. **新行为 = 新组件**，不要把逻辑硬塞进已有组件。
3. **数据驱动优先**：能改常量/数组解决的别写死。
4. **不要改 `src/engine/`**，除非是在加"任何游戏都能用"的通用能力。
5. **换角色要 Mixamo 骨骼**；非标准骨骼要同步改"找手骨/找动画"两处。
6. **别提交 `node_modules/`**（已在 `.gitignore`）。

## 运行与验证（改完必须做）
```bash
npm install
npm run dev        # → http://127.0.0.1:5176/，点 DEPLOY
```
改完**要真的在浏览器里跑起来操作一遍确认效果**（WASD 移动 / 左键射击 / V 切视角），不能只看代码通过。

## 边界（别答应做不到的事）
- 能做：实时 3D、物理、动画、光照、完整玩法循环、多品类换皮、GTA 式**机制**（坐车/通缉/任务，见 ARCHITECTURE.md §7）。
- 不能做：真·GTA/开放世界级的无缝大地图 + 海量内容 + AAA 画质（web 平台 + 内容量限制）。
- 想往大世界走：缺的是"地形 + 分块流式加载 + LOD"这套系统，是进阶大工程，不是改几行。
