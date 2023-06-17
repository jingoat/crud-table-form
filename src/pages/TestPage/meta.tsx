import type { CrudTableProps } from '../../components/CrudTable';
import { ActionButton } from '../../components/CrudTable';
import type { PageContainerProps } from '../../components/PageContainer';
import { dateTimeFormatFn } from '../../util/normal';
import { filterObject } from '../../util/utils';

export const pageOptions: PageContainerProps = {
  title: 'stockTransferTask',
  breadcrumbs: [
    { breadcrumbName: 'datacenter', path: '/iwms/data-center' }, // '配置中心',
    {
      breadcrumbName: 'inventoryManagement',
      path: '/iwms/data-center/stock-manage',
    },
    { breadcrumbName: 'stockTransferTask' },
  ],
};

// 移库列表配置
export const generateTableOptions = (props): CrudTableProps<any> => {
  const { onDetail, valueEnums } = props;
  return {
    rowKey: 'taskNo',
    request: async (params, sorter, filter = {}) => {
      const { current, ...rest } = params;
      const filterParams = {};
      for (const [key, value] of Object.entries(filter)) {
        filterParams[key] = Array.isArray(value) ? value[0] : value;
      }
      let allParams = { ...rest, pageIndex: current, ...filterParams };
      // 去除无效键值对
      allParams = filterObject(allParams);

      // const { data, code } = await stockTransferTaskList({
      //   ...allParams,
      // });
      // return { data: data?.results, total: data?.total, success: code === '0' };
      return { data: [{orderNo:1111}], total: 100, success: true };
    },
    columns: [
      {
        title: '#',
        dataIndex: 'index',
        valueType: 'index',
        fixed: 'left',
        width: 70,
      },
      {
        title: '移库单号',
        label: '移库单号',
        dataIndex: 'orderNo',
      },
      {
        title: '任务编号',
        label: '任务编号',
        dataIndex: 'taskNo',
        hideInSearch: true,
      },
      {
        dataIndex: 'status',
        label: '任务状态',
        title: '任务状态',
        valueEnum: {},
        hideInSearch: true,
        filters: true,
        filterMultiple: false,
      },
      {
        title: '料箱编码',
        label: '料箱编码',
        dataIndex: 'containerCode',
        hideInSearch: true,
      },
      {
        dataIndex: 'containerHotLevel',
        label: '料箱热度',
        title: '料箱热度',
        valueType: 'select',
        valueEnum: {},
        hideInSearch: true,
        filters: true,
        filterMultiple: false,
      },
      {
        dataIndex: 'sourceLocation',
        label: '来源库位',
        title: '来源库位',
        hideInSearch: true,
      },
      {
        dataIndex: 'sourceLocationHotLevel',
        label: '原库位热度',
        title: '原库位热度',
        hideInSearch: true,
      },
      {
        dataIndex: 'targetLocation',
        label: '目标库位',
        title: 'targetLocation',
        hideInSearch: true,
      },
      {
        dataIndex: 'targetLocationHotLevel',
        label: '新库位热度',
        title: '新库位热度',
        valueType: 'select',
        valueEnum: {},
        hideInSearch: true,
        filters: true,
        filterMultiple: false,
      },
      {
        dataIndex: 'createTime',
        label: '创建时间',
        title: '创建时间',
        renderText: dateTimeFormatFn,
        hideInSearch: true,
      },
      {
        dataIndex: 'finishTime',
        label: '完成时间',
        title: '完成时间',
        renderText: dateTimeFormatFn,
        hideInSearch: true,
      },
      {
        dataIndex: 'option',
        label: '操作',
        valueType: 'option',
        fixed: 'right',
        title: '操作',
        render: (dom, record, index) => [
          <ActionButton
            key='detail'
            onClick={() => {
              onDetail(record, index);
            }}
          >
            详情
          </ActionButton>,
        ],
      },
    ],
  };
};

// 移库详情配置
export const dialogTableOptions: CrudTableProps<any> = {
  search: false,
  request: async (params, sorter, filter) => {
    const { current, ...rest } = params;

    // const { data, code } = await stockTransferTaskDetailList({ ...rest, pageIndex: current });

    // return { data: data?.results, total: data?.total, success: code === '0' };
    return { data: [{containerCode:'22222'}], total: 100, success: true }
  },
  columns: [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      fixed: 'left',
      width: 70,
    },
    {
      title: '料箱编码',
      label: '料箱编码',
      dataIndex: 'containerCode',
      hideInSearch: true,
    },
    {
      dataIndex: 'warehouseAreaCode',
      label: '库区',
      title: '库区',
      hideInSearch: true,
    },
    {
      dataIndex: 'warehouseLogicCode',
      label: '逻辑区',
      title: '逻辑区',
      hideInSearch: true,
    },
    {
      title: '货主编码',
      label: '货主编码',
      dataIndex: 'customerCode',
      hideInSearch: true,
    },
    {
      title: '货主名称',
      label: '货主名称',
      dataIndex: 'customerName',
      hideInSearch: true,
    },
    {
      dataIndex: 'skuName',
      label: '商品名称',
      title: '商品名称',
      hideInSearch: true,
    },
    {
      dataIndex: 'skuCode',
      label: '商品编码',
      title: '商品编码',
      hideInSearch: true,
    },
    {
      dataIndex: 'hotLevel',
      label: '热度等级',
      title: '热度等级',
      hideInSearch: true,
    },
    {
      dataIndex: 'qty',
      label: '库存数量',
      title: '库存数量',
      hideInSearch: true,
    },
  ],
};
