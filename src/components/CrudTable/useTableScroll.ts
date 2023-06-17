import type { TableProps } from 'antd';
import type { MutableRefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'react-use';
import type { CrudTableProps } from './type';

const MIN_TABLE_HEIGHT = 300;
const PAGINATION_HEIGHT = 56;
const CARD_PADDING_BOTTOM = 8;
const CARD_MARGIN_BOTTOM = 24;

type Props = Pick<CrudTableProps<any>, 'scrollYOffset' | 'pagination' | 'columns'> & {
  collapsed: boolean;
  dataSource: any[];
};

/**
 * 动态计算ScrollY
 * @param {TableColumn[]} [columns=[]]
 * @param {Config} [config={}]
 * @returns {([MutableRefObject<HTMLDivElement | null>, TableProps<any>['scroll']])}
 */
const useTableScroll = (props: Props): [MutableRefObject<HTMLDivElement | null>, TableProps<any>['scroll']] => {
  const { scrollYOffset = 0, pagination, collapsed, columns, dataSource } = props;
  const [scrollY, setScrollY] = useState<string | number | undefined>();
  const { height: clientHeight } = useWindowSize();
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const y = calcScrollY();
    setScrollY(y);
  }, [clientHeight, collapsed]);

  // 防止列数较多且column没有设width, 没有内容时表头标题换行
  const scrollX = columns.length > 10 && !dataSource.length ? '100%' : 'max-content';

  const calcScrollY = () => {
    // 这里用header计算, body会有一点延迟
    const antTableHeader = tableContainerRef.current?.querySelector('.ant-table-thead');
    const offsetBottom = antTableHeader?.getBoundingClientRect().bottom ?? 0;
    const y =
      clientHeight -
      offsetBottom -
      (pagination ? PAGINATION_HEIGHT : 0) -
      CARD_PADDING_BOTTOM -
      CARD_MARGIN_BOTTOM +
      scrollYOffset; // 减去各种边距
    return Math.max(y, MIN_TABLE_HEIGHT);
  };

  return [tableContainerRef, { x: scrollX, y: scrollY }];
};

export default useTableScroll;
