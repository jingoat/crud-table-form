import type { ProColumns, ProTableProps } from '@ant-design/pro-table';

export type TableColumn<T = any> = ProColumns<T> & {
  /** 枚举相关, 需要用useTableColumns才生效 */
  enumType?: string;
  labelKey?: string;
  valueKey?: string;
  /** 只是备注字段, 无实际用途 */
  label?: string;
  /** 列最大宽度, ellipsis true需要设置maxWidth才生效 */
  maxWidth?: number | string;
};

export type CrudTableProps<T> = ProTableProps<T, any> & {
  columns: TableColumn<T>[];
  /** scrollY偏差值 */
  scrollYOffset?: number;
  /** column默认宽度 */
  columnWidth?: number | string;
  /** 开启虚拟列表 */
  virtualList?: boolean;
};
