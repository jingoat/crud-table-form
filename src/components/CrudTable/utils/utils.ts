interface ValueEnum {
  [key: string]: { text: string };
}

export const isFunction = (value: unknown): value is Function => typeof value === 'function';

export const mergeArrayByKey = <T extends Record<string, unknown>>(initialArr: T[], arr: T[], key: string): T[] => {
  let tempArr = [...arr];
  const result = initialArr.map((item, i) => {
    const index = tempArr.findIndex((arrItem) => item[key] && arrItem[key] && arrItem[key] === item[key]);
    if (index > -1) {
      return Object.assign({}, item, ...tempArr.splice(index, 1));
    }
    return item;
  });
  return result.concat(tempArr);
};

/**
 *  用在search.transform, 处理时间范围, 拆分成两个字段
 *
 * @param {*} [value=[]]
 * @param {string} [key=''] dataIndex格式: startCreateTime-endCreateTime
 * @returns
 */
export const transformDateTimeRange = (value = [], dataIndex = ''): Record<string, any> => {
  if (!dataIndex?.includes('-')) return { [dataIndex]: value };
  const [startTimeKey, endTimeKey] = dataIndex.split('-');
  const [startTimeValue, endTimeValue] = value as string[];

  return {
    [startTimeKey]: startTimeValue ? new Date(startTimeValue).getTime() : undefined,
    [endTimeKey]: endTimeValue ? new Date(endTimeValue).getTime() : undefined,
  };
};
/**
 * 将选项转为枚举
 *
 * @param {*} options
 * @returns
 */
export const transformOptionsToValueEnum = (
  options: Record<string, any>[],
  labelKey = 'label',
  valueKey = 'value',
): ValueEnum | undefined => {
  if (!options) return undefined;
  const valueEnum = {};
  options.forEach((item) => {
    valueEnum[item[valueKey]] = { text: item[labelKey] };
  });
  return valueEnum;
};
