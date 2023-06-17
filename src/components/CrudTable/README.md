> 表格使用文档

# CrudTable

此表格组件基于 antd 的 [pro-table](https://hairobotics.feishu.cn/wiki/wikcnp3q1qOXNdQq4SzCesPtzih#)，在 ProTable 上进行了一层封装，支持所有 ProTable 的 API，增加一些预设, 提供了转换旧 meta json 的方法。你可以把它完全当做 Ant Design 的 ProTable/Table 来用。

增加的预设

1. 表格自适应高度
2. Column 自适应 width
3. 列设置持久化缓存
4. 处理枚举，通过 enumType 生成 valueEnum
5. 支持虚拟滚动

### API

> 这里只列出新增的 API。 完整 API 参考 [ProTable 文档](https://procomponents.ant.design/components/table#protable)

#### Table

| 属性          | 描述                                                | 类型              | 默认值  |
| ------------- | --------------------------------------------------- | ----------------- | ------- |
| scrollYOffset | 计算 Table scroll.y 的偏差值                        | `number`          | 0       |
| columnWidth   | 每个 column 默认宽度，auto 或空时根据内容自适应宽度 | `number` `string` | -       |
| virtualList   | 是否开启虚拟列表                                    | `boolean`         | `false` |

#### Column 列定义

建议能设 width 就尽量设置

| 属性     | 描述          | 类型     | 默认值    |
| -------- | ------------- | -------- | --------- |
| enumType | 枚举值        | `string` | -         |
| labelKey | 枚举 labelKey | `string` | enumValue |
| valueKey | 枚举 valueKey | `string` | label     |

#### [详细文档](https://hairobotics.feishu.cn/wiki/wikcnp3q1qOXNdQq4SzCesPtzih#)
