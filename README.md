# MC 1.21.11 附魔武器指令生成器

一个用于生成 Minecraft Java 1.21.11 新版物品组件格式 `/give` 指令的静态网页工具。

## 功能

- 选择目标玩家：支持 `@a`、`@p`、`@r`、`@s`，也可以输入自定义玩家名。
- 选择常用物品：内置剑、斧、镐、铲、锄、弓、弩、三叉戟、重锤和部分实用工具。
- 自定义物品 ID：可输入完整或自定义物品 ID，例如 `minecraft:diamond_sword`。
- 添加多条附魔：支持常见武器、工具、弓、弩、三叉戟、重锤、钓鱼竿和通用附魔。
- 自定义附魔 ID：可输入数据包或模组提供的附魔 ID。
- 自动校验输入：目标、物品、附魔 ID 不能包含空格，附魔等级必须是大于等于 `1` 的正整数。
- 实时预览指令，并支持一键复制。

## 文件结构

```text
.
├── index.html   # 页面结构
├── style.css    # 页面样式
├── script.js    # 指令生成和交互逻辑
└── README.md    # 项目说明
```

## 使用方法

直接用浏览器打开 `index.html` 即可使用，不需要安装依赖或启动服务器。

1. 选择或填写目标玩家。
2. 选择常用物品，或者填写自定义物品 ID。
3. 点击“新增附魔”添加附魔条目。
4. 选择附魔属性，填写等级。
5. 在右侧查看生成的 `/give` 指令。
6. 点击“复制指令”，将指令粘贴到 Minecraft 聊天框或命令方块中使用。

## 指令格式示例

```mcfunction
/give @a diamond_sword[enchantments={sharpness:1}]
```

多条附魔会合并到同一个 `enchantments` 组件中：

```mcfunction
/give Steve minecraft:netherite_sword[enchantments={sharpness:5,unbreaking:3,mending:1}]
```

## 兼容说明

本工具面向 Minecraft Java 1.21.11 的新版物品组件格式。旧版本 Minecraft 使用的 NBT 附魔格式不同，生成的指令不一定适用。
