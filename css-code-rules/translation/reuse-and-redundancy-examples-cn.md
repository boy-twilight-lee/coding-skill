# 复用与冗余示例

> 本文件仅翻译 `css-code-rules/references/reuse-and-redundancy-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

1. 全局只定义一次 `box-sizing`；删除重复尺寸和无效声明，只有可观察行为需要时保留常见声明。

## 场景 1：删除冗余固定尺寸声明

固定尺寸已表达最小值时不再重复 min/flex-basis；删除在实际格式化上下文中无效的声明。

**正例：**

```less
.talent-row {
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }
}
```

**反例：**

```less
.talent-row {
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    min-height: 40px;
    min-width: 40px;
    display: block;
    flex: 0 0 40px;
    flex-shrink: 0;
  }
}
```

## 场景 2：区分重置噪音和可观察行为

不重复全局重置，但会影响收缩、截断或交互的声明即使常见也要保留。

**正例：**

```less
.talent-card {
  font-size: 14px;
  line-height: 1;
}
```

```less
.talent-row {
  .talent-row-content {
    min-width: 0;
    flex: 1;
  }
}
```

**反例：**

```less
.talent-card {
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1;
}
```

## 场景 3：提取重复模式

确认多处真实重复后再提取聚焦的 mixin、变量或工具，不能混入无关颜色、间距或组件尺寸。

**正例：**

```less
.inline-center-fixed() {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.text-ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@motion-standard: transform 160ms ease;

.talent-card {
  .talent-card-action {
    .inline-center-fixed();
    transition: @motion-standard;
  }

  .talent-card-badge {
    .inline-center-fixed();
    transition: @motion-standard;
  }

  .talent-card-title {
    .text-ellipsis();
  }

  .talent-card-summary {
    .text-ellipsis();
  }
}
```

**反例：**

```less
.talent-action-style() {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  padding: 8px;
  color: var(--color-primary);
}

.talent-card-action {
  .talent-action-style();
}
```

## 场景 4：循环只用于稳定机械序列

循环只生成命名和增量都稳定可预测的序列，不用于不规则业务状态或一次性短声明。

**正例：**

```less
.talent-card {
  .generate-delay(@index) when (@index <= 6) {
    &.talent-card-delay-@{index} {
      transition-delay: (@index * 40ms);
    }
    .generate-delay(@index + 1);
  }
  .generate-delay(1);
}
```

**反例：**

```less
.talent-card {
  .generate-state(@index) when (@index <= 3) {
    &.talent-card-state-@{index} {
      color: if(@index = 1, green, if(@index = 2, orange, red));
    }
    .generate-state(@index + 1);
  }
  .generate-state(1);
}
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
