import type { PageContainerProps } from '../../PageContainer';
import { metaRequest } from '../../../util/handleRequest';

import type { CrudTableProps, TableColumn } from '../type';
import { isFunction, transformDateTimeRange, transformOptionsToValueEnum } from './utils';
const SUCCESS_CODE = '0';

interface MetaResult {
  tableOptions: CrudTableProps<any>;
  pageOptions: PageContainerProps;
  columns: TableColumn[];
}

export const transformMeta = (metaData): MetaResult => {
  const { tabs, mainTitle } = metaData;
  const [{ filter, grid }] = tabs;
  const { columns } = grid;

  return {
    pageOptions: transformMainTitle(mainTitle),
    tableOptions: transformGrid(grid),
    columns: transformColumns(columns, filter),
  };
};

const transformMainTitle = (mainTitle) => {
  const { breadcrumbs } = mainTitle;
  const pageOptions = {
    ...mainTitle,
    title: mainTitle.title,
    breadcrumbs: breadcrumbs?.map((item) => {
      const { label, link } = item;
      return { breadcrumbName: label, path: link };
    }),
  };
  return pageOptions;
};

const transformGrid = (grid) => {
  const request = transformRequest(grid);
  return { request, ...grid };
};

export const transformColumns = (columns, filter?) => {
  const formColumns =
    filter?.filterParams?.map((item) => {
      const { type, label, intlId, dataIndex, intlPlaceholder, fieldProps, multiple, labelKey, valueKey, options } =
        item;

      return {
        search:
          type === 'rangeTime'
            ? {
                transform: transformDateTimeRange,
              }
            : undefined,
        ...item,
        fieldProps: isFunction(fieldProps)
          ? (form, config) => fieldProps(form, config)
          : {
              mode: multiple ? 'multiple' : undefined,
              fieldNames: { label: labelKey, value: valueKey },
              options: options,
              showSearch: true,
              allowEmpty: type === 'rangeTime' ? [true, true] : undefined, // 允许起始项部分为空
              ...fieldProps,
            },

        label,
        dataIndex,
        title: intlPlaceholder,
        hideInTable: true,
        ...transformValueType(item),
      };
    }) || [];

  const tableColumns = columns.map((item) => {
    let {
      intlId,
      valueEnum,
      options,
      labelKey,
      valueKey,
      render,
      filterDataIndex,
      formType,
      useQtyCalculateRender,
      dataIndex,
    } = item;

    // 处理转换小数
    // if (useQtyCalculateRender) {
    //   render = (record) => {
    //     return qtyCalculateRender({ ...record, dataIndex });
    //   };
    // }

    const isDateTimePicker = formType === 'dateTimePicker' && !!filterDataIndex;
    return {
      hideInSearch: !isDateTimePicker, // 时间过滤移到搜索区
      search: isDateTimePicker
        ? {
            transform: (value) => {
              return { [filterDataIndex]: value };
            },
          }
        : undefined,
      filters: !isDateTimePicker && !!filterDataIndex,
      filterMultiple: false,
      ...transformValueType(item),
      ...item,
      title: intlId,
      render: render ? (_, record) => render(record) : undefined,
      valueEnum: valueEnum || transformOptionsToValueEnum(options, labelKey, valueKey),
    };
  });
  return [...formColumns, ...tableColumns];
};

// formType和dataIndex转valueType
const transformValueType = (column) => {
  const { formType, type, dataIndex, fixed, width } = column;
  const typeMap = {
    menu: { valueType: 'select' },
    select: { valueType: 'select' },
    datePicker: { valueType: 'date' },
    dateTimePicker: { valueType: 'dateTime' },
    rangeNumber: { valueType: 'digitRange' },
    rangeTime: { valueType: 'dateTimeRange' },
    switch: { valueType: 'switch' },
    index: { valueType: 'index', fixed: fixed || 'left', width: width || 70 },
    operation: { valueType: 'option', fixed: fixed || 'right', width: width || 150 },
  };

  return typeMap[formType] || typeMap[type] || typeMap[dataIndex];
};

const transformRequest = (grid) => {
  const { fetchUrl, columns, initParams } = grid;
  // eslint-disable-next-line max-params
  const request = async (params, sorter, filter = {}, onRequest) => {
    const { current, ...rest } = params;
    // 处理filter字段
    const formParams = {};
    const filterEntries = Object.entries(filter);
    if (filterEntries.length) {
      const filterKeyMap = {};
      columns.forEach((item) => {
        if (item.filterDataIndex) {
          filterKeyMap[item.dataIndex] = item.filterDataIndex;
        }
      });
      for (const [key, value] of Object.entries(filter)) {
        formParams[filterKeyMap[key] || key] = Array.isArray(value) ? value[0] : value;
      }
    }

    const fetchParams = {
      ...initParams,
      ...rest,
      pageIndex: current,
      ...formParams,
    };
    onRequest?.(fetchParams);
    const { data, code } = await metaRequest(fetchUrl, {
      params: fetchParams,
    });

    if (code !== SUCCESS_CODE) {
      return { success: false };
    }

    // filter?.checkedAllParam 只有一个地方用了,请在外部处理
    const { results = [] } = data;
    const datas = Array.isArray(data) ? data : results;
    return { data: datas, total: data?.total, success: true };
  };
  return request;
};
