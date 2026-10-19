# 声明与兼容性示例

> 本文件仅翻译 `css-code-rules/references/declaration-and-compatibility-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

1. 样式通常不写注释；只有非显然兼容性、外部约束或临时例外可用简洁中文解释原因。
2. 空行只分隔真实结构，禁止连续、首尾、块边缘以及相关声明与嵌套之间空行。
3. 声明顺序：定位/溢出、交互、尺寸（高先宽）、margin/padding、背景/边框/效果、文字/颜色、布局、动画，嵌套最后；Stylelint 有不同可执行顺序时遵循配置并报告例外。
4. 合并重复选择器和状态块；只有真实复用才抽象。
5. 新 CSS 能力必须符合目标浏览器或使用项目批准回退。
6. 只格式化修改的样式文件，恢复任务范围外格式变化。

## 场景 1：判断注释是否必要

样式通常不写注释；仅非显然兼容性、外部约束或临时例外可用简洁中文说明原因。

**正例：**

```less
.talent-card {
  color: var(--text-color-primary);
}
```

```less
.legacy-dialog {
  /* 兼容旧版 WebView 的滚动回弹缺陷 */
  -webkit-overflow-scrolling: touch;
}
```

**反例：**

```less
/* 卡片标题样式 */
.talent-card {
  /* 设置主要文字颜色 */
  color: var(--text-color-primary);
}
```

## 场景 2：空行只表达结构

空行只分隔真实选择器组或逻辑区，禁止连续、首尾、块内边缘及声明与相关嵌套之间的空行。

**正例：**

```less
.talent-card {
  overflow: hidden;
  width: 320px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  .talent-card-title {
    color: var(--text-color-primary);
  }
}
```

```less
.talent-card {
  .talent-card-header {
    display: flex;
  }

  &.talent-card-disabled {
    cursor: not-allowed;
  }
}
```

**反例：**

```less

.talent-card {

  width: 320px;


  padding: 16px;

}

```

## 场景 3：应用声明分类顺序

声明依次为定位/溢出、交互、尺寸、外边距/内边距、背景/边框/效果、文字/颜色、布局、动画，嵌套选择器最后。

**正例：**

```less
.talent-card {
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  height: 120px;
  width: 320px;
  margin: 12px 0;
  padding: 16px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-small);
  font-size: 14px;
  line-height: 20px;
  color: var(--text-color-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 160ms ease;
  .talent-card-title {
  }
}
```

**反例：**

```less
.talent-card {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 160ms ease;
  color: var(--text-color-primary);
  font-size: 14px;
  line-height: 20px;
  box-shadow: var(--shadow-small);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
  padding: 16px;
  margin: 12px 0;
  width: 320px;
  height: 120px;
  pointer-events: auto;
  overflow: hidden;
  position: relative;
  .talent-card-title {
  }
}
```

## 场景 4：合并重复选择器块

同一子选择器的间距、边框、布局和状态修改合并到最近拥有者下。

**正例：**

```less
.talent-card {
  .talent-card-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
  }
}
```

**反例：**

```less
.talent-card-header {
  padding: 12px 16px;
}

.talent-card-header {
  border-bottom: 1px solid var(--border-color);
}

.talent-card-header {
  display: flex;
  align-items: center;
}
```

## 场景 5：使用受支持的兼容性回退

先检查 Browserslist 和构建转换；目标不支持新特性时使用项目已有的状态类或批准回退。

**正例：**

```less
.form-field {
  &.form-field-error {
    border-color: var(--color-danger);
  }
}
```

**反例：**

```less
.form-field:has(.form-field-error-message) {
  border-color: var(--color-danger);
}
```

## 场景 6：只格式化修改过的样式文件

仅格式化修改过的样式文件，并恢复任务范围外的纯格式变化。

**正例：**

```text
prettier --write src/components/talent-card/index.less
```

**反例：**

```text
prettier --write "src/**/*.less"
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
