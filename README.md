# 植趣智能花盆｜植物管家体验器 Demo

这是一个可直接发布的静态网页小游戏 Demo。

## 文件结构

- `index.html`：页面结构
- `style.css`：视觉样式
- `script.js`：交互逻辑
- `assets/`：场景背景、花盆阶段图、logo、按钮底图

## 发布方式

最简单方式：
1. 打开 Netlify Drop；
2. 将整个 `plantin-game-demo` 文件夹拖进去；
3. 等待生成链接；
4. 提交生成的网站链接。

也可以上传到 Vercel、GitHub Pages 或 Bolt 项目里。

## 后续常改位置

### 调整花盆在不同背景里的位置
在 `script.js` 里找：

```js
const scenes = {
  'living-room': { x: 29, bottom: 48, width: 23 },
  bedroom: { x: 23, bottom: 35, width: 22 },
  bathroom: { x: 20, bottom: 35, width: 22 },
  balcony: { x: 27, bottom: 39, width: 23 }
}
```

- `x`：花盆横向位置，越大越靠右；
- `bottom`：花盆离底部距离，越大越往上；
- `width`：花盆显示大小，越大越大。

### 替换图片
保持文件名不变，直接替换 `assets/` 文件夹里的图片即可。
