/*
 * @Author: Scott
 * @Date: 2022-05-27 17:04:55
 * @LastEditTime: 2022-05-30 11:44:31
 * @LastEditors: Scott
 * @Description:
 * @FilePath: \Jupiter\src\components\PageContainer\index.tsx
 */
import type { PageHeaderProps } from 'antd';
import React from 'react';

export interface Route {
  path?: string;
  breadcrumbName: string | React.ReactNode;
  children?: Omit<Route, 'children'>[];
}

// docs see: https://ant.design/components/page-header-cn/
export interface PageContainerProps extends PageHeaderProps {
  breadcrumbs?: Route[]; // 面包屑数据
  headerChildren?: React.ReactNode; // PageHeader子节点
}

const PageContainer: React.FC<PageContainerProps> = (props) => {
  const { children } = props;

  return <div>{children}</div>;
};

export default PageContainer;
