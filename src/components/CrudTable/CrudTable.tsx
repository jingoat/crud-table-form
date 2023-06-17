import ProTable from '@ant-design/pro-table';
import React, { memo, useMemo, useState } from 'react';
import { VList } from 'virtuallist-antd';
import type { CrudTableProps, TableColumn } from './type';
import useTableScroll from './useTableScroll';

// ProTable额外默认配置
const tableDefaultOptions: Omit<CrudTableProps<any>, 'columns'> = {
  rowKey: 'id',
  pagination: { defaultPageSize: 20, showSizeChanger: true },
  options: {
    density: false,
    reload: true,
    setting: true,
  },
  tableAlertRender: false,
  size: 'middle',
};

const COLOMN_MIN_WIDTH = 100; // 默认最小列宽

const CrudTable = memo(<T extends Record<string, unknown>>(props: CrudTableProps<T>) => {
  const { rowKey, virtualList, expandable } = props;
  const {
    columns,
    scroll,
    columnWidth = COLOMN_MIN_WIDTH,
    form,
    columnsState,
    search,
    scrollYOffset,
    onDataSourceChange,
    ...rest
  } = props;
  const [collapsed, setCollapsed] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [tableContainerRef, tableScroll] = useTableScroll({
    scrollYOffset,
    pagination: props.pagination || tableDefaultOptions.pagination,
    collapsed,
    dataSource,
    columns,
  });

  // 列设置持久化Key, 需保证唯一, 有重时自行配置columnsState
  const persistenceKey =
    props.options === false || props.options?.setting === false
      ? undefined
      : `table-columns-${rowKey}-${columns[1]?.dataIndex}`;

  // 处理宽度和render
  const memoColumns = useMemo(() => {
    return columns?.map((item: TableColumn, index) => {
      const { dataIndex, width = columnWidth, maxWidth, valueType, ellipsis, render } = item;

      if (ellipsis && render) {
        console.log(`请检查${dataIndex}列: render存在时ellipsis会失效, 用renderText代替`);
      }

      // 特殊列不处理
      const renderFn =
        valueType === 'index' || valueType === 'option' || (expandable && index === 0)
          ? render
          : (dom, ...rest) => (
              <div
                style={{
                  whiteSpace: !maxWidth || ellipsis ? 'nowrap' : 'normal', // 不设最大宽度或省略时, 内容超出宽度不换行
                  // scroll.x=max-content下支持省略, 但不会撑满多余宽度, 列数少时慎用
                  maxWidth: maxWidth ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : undefined,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {/* @ts-ignore */}
                {render ? render(dom, ...rest) : dom}
              </div>
            );

      return {
        ...item,
        width: width,
        render: renderFn,
      };
    });
  }, [columns, columnWidth]);

  const mergedScroll = { ...tableScroll, ...scroll };

  const memoComponents = useMemo(() => {
    return virtualList && mergedScroll.y ? VList({ height: mergedScroll.y, resetTopWhenDataChange: false }) : undefined;
  }, [virtualList, mergedScroll.y]);

  // collapsed 受控
  const handleSearchCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleDataSourceChange = (data) => {
    setDataSource(data);
    onDataSourceChange?.(data);
  };

  return (
    <div ref={tableContainerRef}>
      <ProTable<T>
        {...tableDefaultOptions}
        columnsState={{
          persistenceKey: persistenceKey,
          persistenceType: 'localStorage',
          ...columnsState,
        }}
        form={{ autoComplete: 'off', layout: 'vertical', ...form }}
        scroll={mergedScroll}
        columns={memoColumns}
        components={memoComponents}
        dateFormatter={(value) => value.valueOf()}
        search={search === false ? false : { collapsed, onCollapse: handleSearchCollapse, ...search }}
        onDataSourceChange={handleDataSourceChange}
        {...rest}
      />
    </div>
  );
});

export default CrudTable;
