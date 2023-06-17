/*
 * @Author: 郁南
 * @LastEditors: 郁南
 * @Date: 2021-06-11 09:32:58
 * @LastEditTime: 2021-07-19 17:00:24
 * @FilePath: \Jupiter\src\HOC\Memo\index.js
 * @Description: 使用isEqual，封装高阶函数。移除本地areEqual（不严谨）
 */
import { memo } from 'react';
import isEqual from 'react-fast-compare';

const equalMemo = (component) => memo(component, isEqual);

export default equalMemo;
