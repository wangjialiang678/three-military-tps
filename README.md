# three-military-tps

在 [three-fps-modern](../three-fps-modern) 的同一套 ECS 引擎上做的**第三人称军事射击**（类似《三角洲行动》的越肩视角），**全部美术资产换成了新的、可下载的 CC0 素材**，并新增了**第一/第三人称切换**和**多个士兵 NPC**。

## 与上一个项目的关系

同一个引擎内核（`engine/`），换皮 + 加功能：

| | three-fps-modern（旧） | three-military-tps（本项目） |
|---|---|---|
| 视角 | 第一人称 | **第三人称越肩 + 按 V 切第一人称** |
| 玩家 | 不可见 | **可见士兵角色** |
| 角色 | 怪物 mutant | **士兵**（three.js "Soldier"，Mixamo 骨骼） |
| 敌人 | 1 个怪物 | **5 个士兵变体**（同模型换色） |
| 关卡 | 集装箱码头 GLB | **程序化军事场地**（贴图地面+掩体+围墙） |
| 天空 | 平面贴图 | **Poly Haven HDRI**（黄昏，含城市天际线 + 环境光 IBL） |
| 武器 | AK47 GLB | **程序化低多边形步枪** |
| 物理 | Rapier | Rapier（相同） |

## 运行

```bash
npm install
npm run dev      # → http://127.0.0.1:5176/
```

点 **DEPLOY**，然后：
- **WASD** 移动 · **鼠标** 瞄准（越肩） · **左键** 射击 · **R** 换弹 · **空格** 跳
- **V** —— 切换第一人称 / 第三人称

## 美术资产来源（全部可下载，见下）

| 资产 | 来源 | 许可 | 说明 |
|---|---|---|---|
| 士兵角色 + 动画 | three.js 官方示例 `Soldier.glb` | 免费（three.js 示例资产） | Mixamo 骨骼，含 Idle/Walk/Run |
| 天空 HDRI | Poly Haven `the_sky_is_on_fire` | **CC0** | 黄昏，自带城市/山景，兼作 IBL 环境光 |
| 地面/墙/金属 PBR 贴图 | Poly Haven `concrete` / `concrete_block_wall` / `blue_metal_plate` | **CC0** | diffuse+normal+rough |
| 步枪 | 程序化生成（`util/soldier.ts`） | 自建 | 低多边形，代码搭的 |
| 敌人 | 玩家同模型，代码换色 | — | 5 个配色变体 |

> 下载脚本见项目历史；资产已放在 `public/assets/`。Poly Haven 有公开 API（`api.polyhaven.com`），可脚本化直下。

## 已实现（逐项验证通过）

- 程序化军事场地：贴图地面 + 围墙 + 12 个掩体箱（混凝土/集装箱），全部 Rapier 静态碰撞
- HDRI 天空 + 基于图像的光照（IBL）
- **第三人称越肩相机**，鼠标环绕瞄准；**按 V 切第一人称**（切时隐藏自身模型）
- 可见玩家士兵：WASD 相对相机移动、朝瞄准方向转身、Idle/Walk/Run 动画、右手持步枪
- 射击：屏幕中心射线 → Rapier 碰撞体 → 命中敌人掉血；枪口火光 + 合成枪声（WebAudio）+ 弹药/换弹
- **5 个敌方士兵**（换色变体）：直接追击 AI（idle→chase→shoot→dead）、视线检测、射击玩家掉血、死亡倒地
- HUD：血条 + 弹药

## 代码结构

```
src/
├── engine/          # 通用内核（与 three-fps-modern 完全一致，可跨项目复用）
│   ├── Entity / Component / EntityManager / FiniteStateMachine
│   ├── Physics.ts   Rapier 封装（+ addStaticBox 静态盒子）
│   └── Input.ts
├── util/soldier.ts  # 士兵克隆(带骨骼)/换色、程序化步枪、枪口火光
├── entities/
│   ├── ThirdPersonPlayer.ts   第三人称+FP/TP切换+移动+动画+射击   ← 本项目核心新增
│   ├── SoldierNPC.ts          敌方士兵 AI
│   └── UIManager.ts
└── main.ts          # 程序化关卡 + 天空IBL + 组装实体
```

**换角色**：把 `Soldier.glb` 换成任意 Mixamo 骨骼的 GLB/FBX（角色代码按 `RightHand$` 找手骨、动画按名字找 Idle/Walk/Run）。
**换关卡**：改 `main.ts` 的 `buildArena()`，或换成加载一个关卡 GLB（参照 three-fps-modern 的 trimesh 做法）。

---

## 升级到「写实《三角洲》风」——手动下载指南

本项目走的是**可自动下载的 CC0** 路线（低多边形→半写实）。想要更写实、更像《三角洲行动》的观感，下面这些素材**需要你手动登录下载**（Mixamo/Sketchfab 有登录墙，我无法自动拉），下载后放到指定路径、改一两行代码即可。

### 1) 写实士兵角色 + 动画（Mixamo，最省事，与本管线 100% 兼容）
- 打开 https://www.mixamo.com/ ，免费 Adobe 账号登录
- 角色搜 **"Swat"** 或 **"Vanguard"**（现代/装甲士兵）→ Download，格式选 **FBX Binary**，Pose 选 T-pose
- 动画搜 **idle / walk / run / firing rifle / reload / death**，每个 Download，勾 **"Without Skin"**（只要骨骼动画）
- 放到 `public/assets/characters/`，然后仿照 three-fps-modern 里 mutant 的加载方式（FBXLoader + 分离动画），或直接替换 `Soldier.glb`（若导出成 GLB）。Mixamo 全是同一套骨骼，动画通用。
- 敌人多变体：多下几个士兵角色（Swat / The Boss / Soldier），共用同一批动画。

### 2) 写实武器（Sketchfab，需免费账号）
- **CS2 AK-47**（CC-BY，GLB，含动画）：https://sketchfab.com/3d-models/rifle-ak-47-weapon-model-cs2-6b2244ba66274c71abdd194d0b04f731
- 下载 GLB → 放 `public/assets/weapons/` → 在 `util/soldier.ts` 里把 `buildRifle()` 换成 `GLTFLoader` 加载这个模型。**署名**原作者。

### 3) 写实军事关卡（Sketchfab，需账号）
- **Military Outpost Kit**（碉堡/沙袋/检查站，CC-BY）：https://sketchfab.com/3d-models/military-outpost-kit-10-cc0-010dc4f0a73a48e7a53598c6f24fe9cf
- 下载 GLB → 在 `main.ts` 用 `GLTFLoader` 加载并 `buildLevelCollider`（参照 three-fps-modern 的 trimesh 碰撞），替换 `buildArena()`。

### 4) 音效（OpenGameArt，CC0，免登录）
- 枪声：https://opengameart.org/content/the-free-firearm-sound-library
- 脚步：https://opengameart.org/content/fantozzis-footsteps-grasssand-stone
- 放 `public/assets/sounds/`，用 `THREE.Audio` 替换 WebAudio 合成音。

> 风格统一提醒：写实关卡要配写实角色/武器，别和低多边形混用。全套写实做起来重（要减面、要署名、要登录），但观感最接近《三角洲》。
