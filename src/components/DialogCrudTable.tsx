import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import type { CrudTableProps } from './CrudTable';
import CrudTable, { useTableColumns } from './CrudTable';
import withMemo from '../HOC/Memo';

interface IProps {
  open?: boolean;
  isBird?: boolean;
  onClose?: any;
  dialogBoxProps?: any;
  title?: React.ReactElement | string;
  titleId?: string;
  tableOptions?: CrudTableProps<any>;
  currentIndex?: number;
  onBirdChange?: (number) => void;
  params?: Record<string, any> | (<T extends Record<string, any>>(record: T) => T);
  parentSource?: any[];
}

// 全屏弹窗Table
const DialogCrudTable: React.FC<IProps> = withMemo((props) => {
  const {
    isBird = true,
    dialogBoxProps = {},
    onClose,
    parentSource = [],
    open,
    title,
    titleId,
    tableOptions,
    currentIndex,
    onBirdChange,
    params,
  } = props;

  const [columns] = useTableColumns(tableOptions.columns);
  // 点击左右按钮-上一条数据/下一条数据
  const handleBirdChange = ({ index, forward }) => {
    onBirdChange(index);
  };
  const [requestParams, setRequestParams] = useState();

  useEffect(() => {
    if (!open) return;
    if (typeof params !== 'function') {
      setRequestParams(params);
      return;
    }
    const record = parentSource[currentIndex];
    if (!record) return;
    setRequestParams(params(record)); // params变化会自动请求
  }, [parentSource, currentIndex, open, params]);
  return (
    <Modal visible={open} onCancel={onClose} style={{ zIndex: 999 }}>
      <div bgcolor='#f3f3f3' className='w-100 h-100 relative' {...dialogBoxProps} style={{ overflowY: 'auto' }}>
        {/* Header */}

        {/* Content */}
        <div>
          <CrudTable
            style={{ marginLeft: '40px', marginRight: '40px' }}
            tableStyle={{ paddingTop: '20px' }}
            params={requestParams}
            scroll={{ y: 'calc(100vh - 275px - 110px)' }} // +搜索条件高度
            options={false}
            {...tableOptions}
            columns={columns}
          />
        </div>
      </div>
    </Modal>
  );
});

export default DialogCrudTable;
