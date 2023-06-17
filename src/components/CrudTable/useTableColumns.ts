import { useCallback, useEffect, useState } from "react";
import type { TableColumn } from "./index";
import { isFunction, mergeArrayByKey } from "./utils/utils";

type SetMergeState<S> = (
  state: S | ((prevState: Readonly<S>) => S),
  identity?: string
) => void;

/**
 *  此hook作用
 *  1.注入redux枚举
 *  2.提供更新columns的方法, 类似setState接收function或columns, 更新column通过dataIndex来查找, 匹配不到则新增
 */
const useTableColumns = (
  initialColumns: TableColumn[] = []
): [TableColumn[], SetMergeState<TableColumn[]>] => {
  const [columns, setColumns] = useState(initialColumns);

  const { enums }: any = {};

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  useEffect(() => {
    if (!enums || !Object.keys(enums).length) return;

    setColumns((prevState) => {
      const nextState = prevState.map((item) => {
        const { enumType, labelKey = "label", valueKey = "enumValue" } = item;
        if (!enumType) return item;

        // 处理枚举
        const tableValueEnum = {};
        // eslint-disable-next-line max-nested-callbacks
        enums[enumType]?.forEach((enumItem) => {
          tableValueEnum[enumItem[valueKey]] = { text: enumItem[labelKey] };
        });
        return { ...item, valueEnum: tableValueEnum };
      });
      return nextState;
    });
  }, [enums, initialColumns]);

  const setMergeColumns = useCallback(
    (patch, identity = "dataIndex") => {
      setColumns((prevState) => {
        const newState = isFunction(patch)
          ? patch(prevState)
          : mergeArrayByKey(prevState, patch, identity);
        return newState ? newState : prevState;
      });
    },
    [initialColumns]
  );

  return [columns, setMergeColumns];
};

export default useTableColumns;
