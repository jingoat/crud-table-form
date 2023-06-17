import CrudTable from '../../components/CrudTable';
import PageContainer from '../../components/PageContainer';
import DialogCrudTable from '../../components/DialogCrudTable';
import type { ActionType } from '@ant-design/pro-table';
import React, { useMemo, useRef, useState } from 'react';
import { dialogTableOptions, generateTableOptions, pageOptions } from './meta';

interface dialogObj {
  open: boolean;
  currentIndex?: number;
}
const SerialNumberStock: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const { valueEnums }:any ={};

  const [tableDialogState, setTableDialogState] = useState<dialogObj>({ open: false }); // 弹窗数据
  const [source, setSource] = useState([]);

  // 详情
  const onDetail = async (ops, index) => {
    setTableDialogState({
      open: true,
      currentIndex: index,
    });
  };

  const tableOptions = useMemo(() => generateTableOptions({ valueEnums, onDetail }), [valueEnums]);

  const onClose = (flag) => {
    setTableDialogState({
      open: false,
    });
    flag && tableRef.current?.reload();
  };

  const onBirdChange = (index) => {
    setTableDialogState((prevState) => ({ ...prevState, currentIndex: index }));
  };

  return (
    <PageContainer {...pageOptions}>
      <CrudTable
        {...tableOptions}
        actionRef={tableRef}
        onDataSourceChange={(data: any) => {
          setSource(data);
        }}
      />

      {/* 详情弹框 */}
      <DialogCrudTable
        {...tableDialogState}
        title={'detail'}
        onClose={onClose}
        isBird={true}
        parentSource={source}
        tableOptions={dialogTableOptions}
        onBirdChange={onBirdChange}
        params={(record) => ({
          taskNo: record.taskNo,
        })}
      />
    </PageContainer>
  );
};

export default SerialNumberStock;
