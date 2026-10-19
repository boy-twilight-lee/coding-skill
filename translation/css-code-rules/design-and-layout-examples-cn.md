# 设计与布局示例

> 本文件仅翻译 `css-code-rules/references/design-and-layout-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

1. 复用令牌、工具和语义值；只有真实重复时使用变量、mixin 或循环。
2. 一维布局优先 Flexbox 与 `gap`；Grid 只用于 Flex 无法正确表达的真实二维对齐。
3. 尊重仓库既有目标端所有权。Vue 项目的桌面端与移动端已由独立目录表达时，架构归 `vue-code-rules` 管理；样式只留在受影响目标端，不能用组件内媒体查询绕过边界。真正共享的响应式实现遵循仓库既有策略。
4. 遵循项目单位策略；常规尺寸用 `px`，交给 PostCSS 转换，真实视口关系才用视口单位。
5. 组件库定制优先公开 CSS 变量，不无谓提高特异性或使用 `!important`。

## 场景 1：复用现有设计令牌

先复用项目令牌、工具类和语义值，避免近似字面量；只有真实重复时才提取变量或 mixin。

**正例：**

```less
.talent-card {
  padding: var(--spacing-medium);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-medium);
  color: var(--text-color-primary);
}
```

**反例：**

```less
.talent-card {
  padding: 15px;
  border: 1px solid #e4e7ec;
  border-radius: 7px;
  color: #303133;
}
```

## 场景 2：用 Flexbox 构建一维布局

一维布局优先 Flexbox 与 `gap`；剩余区域使用 `flex: 1`，固定区域防收缩，省略号依赖处补 `overflow: hidden`。

**正例：**

```less
.talent-row {
  display: flex;
  align-items: center;
  gap: 12px;
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }

  .talent-row-content {
    overflow: hidden;
    flex: 1;
    .talent-row-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
```

```less
.schedule-matrix {
  display: grid;
  grid-template-columns: 120px repeat(5, minmax(160px, 1fr));
  gap: 8px;
  .schedule-matrix-cell {
    min-height: 80px;
  }
}
```

**反例：**

```less
.talent-row {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
}
```

## 场景 3：尊重目标端所有权

先由应用架构确定目标端所有权。Vue 已分离桌面端和移动端实现时，每个呈现变更都留在对应目标端拥有的样式文件：

不要在任一目标端样式中通过组件局部媒体查询重新实现另一端：

仓库有意采用共享响应式实现时，媒体查询仍然有效；基础规则与响应式调整都放在共享拥有者中：

CSS 负责呈现技术，`vue-code-rules` 负责组件属于共享树还是目标端专属树。仓库其他位置存在媒体查询，并不能覆盖当前组件的所有权。

**正例：**

```text
src/pages/talent-list/index.less
src/pages-pc/talent-list/index.less
```

```less
.talent-list {
  width: 100%;
}

@media (min-width: 1024px) {
  .talent-list {
    width: 960px;
  }
}
```

**反例：**

```less
@media (max-width: 768px) {
  .talent-list {
    padding: 12px;
  }
}
```

## 场景 4：遵循已配置的单位策略

按项目单位策略书写；常规尺寸使用 `px` 并交给 PostCSS 转换，只有真实视口关系才直接使用视口单位。

**正例：**

```less
.talent-card {
  width: 320px;
  padding: 16px;
  font-size: 14px;
}
```

```less
.full-screen-panel {
  min-height: 100vh;
}
```

**反例：**

```less
.talent-card {
  width: 85.3333vw;
  padding: 4.2667vw;
  font-size: 3.7333vw;
}
```

## 场景 5：在局部定制组件库

优先使用库公开的 CSS 自定义属性做局部定制，避免不必要的高优先级和 `!important`。

**正例：**

```less
.talent-dialog {
  --el-dialog-border-radius: 12px;
}
```

**反例：**

```less
.page .content .talent-dialog.el-dialog {
  border-radius: 12px !important;
}
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
