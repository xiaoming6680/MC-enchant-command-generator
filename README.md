# MC Java 多版本附魔指令生成器

一个用于生成 Minecraft Java Edition 多版本 `/give` 附魔物品指令的静态网页工具。

网页入口：https://xiaoming6680.github.io/MC-enchant-command-generator/

## 功能

- 支持 Java 1.21.5+、Java 1.20.5 - 1.21.4、Java 1.13 - 1.20.4 和 Java 1.8 - 1.12.2 四种指令格式。
- 支持选择或输入目标玩家、物品 ID，以及搜索内置选项。
- 提供物品 ID 查询入口：https://mcid.lingningyu.cn/
- 支持设置物品数量，必须是大于等于 `1` 的正整数。
- 数量为 `1` 时省略命令中的数量参数；数量为 `2` 或以上时追加对应数量。
- 支持添加多条附魔，也支持输入自定义附魔 ID。
- 根据所选 Java 版本筛选可用物品和附魔。
- Java 1.8 - 1.12.2 模式会将可识别的内置附魔转换为数字附魔 ID。
- 实时预览指令，并支持一键复制。
- 初始化和重置时目标、物品均为空，默认不添加附魔。
- 初始化时显示填写提示；用户操作后分别校验目标和物品，不会因为修改一个字段而同时提示另一个未操作字段的错误。

## 文件结构

```text
.
├── index.html   # 页面结构
├── style.css    # 页面样式
├── script.js    # 指令生成与交互逻辑
└── README.md    # 项目说明
```

## 使用方法

直接用浏览器打开 `index.html` 即可使用，不需要安装依赖或启动服务器。

1. 选择 Minecraft Java 版本格式。
2. 选择或输入目标玩家。
3. 搜索并选择物品，或输入自定义物品 ID。
4. 设置物品数量，默认数量为 `1`。
5. 如需附魔，点击“新增附魔”，然后选择或输入附魔 ID 并填写等级。
6. 在右侧查看生成的 `/give` 指令。
7. 点击“复制指令”，将命令粘贴到 Minecraft 聊天框或命令方块中使用。

目标玩家和物品是生成命令的必填项。点击“重置”后会恢复为空目标、空物品、数量 `1` 且无附魔的初始状态。

## 指令格式示例

以下示例使用数量 `1`，因此命令末尾不追加数量参数。

Java 1.21.5+：

```mcfunction
/give @a diamond_sword[enchantments={sharpness:5}]
```

Java 1.20.5 - 1.21.4：

```mcfunction
/give @a diamond_sword[enchantments={levels:{sharpness:5}}]
```

Java 1.13 - 1.20.4：

```mcfunction
/give @a diamond_sword{Enchantments:[{id:"minecraft:sharpness",lvl:5s}]}
```

Java 1.8 - 1.12.2：

```mcfunction
/give @a minecraft:diamond_sword {ench:[{id:16,lvl:5s}]}
```

数量为 `2` 时，示例命令会包含数量参数：

```mcfunction
/give @a diamond_sword[enchantments={sharpness:5}] 2
```

## 版本兼容说明

本工具面向 Minecraft Java Edition：

- Java 1.20.5 起使用物品组件格式。
- Java 1.13 - 1.20.4 使用字符串 ID 的 NBT 附魔格式。
- Java 1.8 - 1.12.2 使用旧版 `/give <目标> <物品> <数量> <数据值> <NBT>` 格式和数字附魔 ID。

物品和附魔选项会根据所选版本进行筛选。旧版模式只能转换内置映射中存在数字 ID 的附魔；较新的物品或附魔不适用于 Java 1.8 - 1.12.2。
