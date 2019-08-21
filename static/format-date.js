const PATTERM_SPECIF = 'yyyy-mm-dd HH:MM:SS';
const PATTERM_REGEX = /y{2,4}|m{1,2}|d{1,2}|H{1,2}|M{1,2}|S{1,2}|w|s/g;
const WEEK = '日一二三四五六'.split('');

//占位补0
const fillIn = value => `0${value}`.slice(-2);

//将时间格式转成对象模式
const date2object = date => ({
  year: `${date.getFullYear()}`,
  month: `${date.getMonth() + 1}`,
  date: `${date.getDate()}`,
  hours: `${date.getHours()}`,
  minutes: `${date.getMinutes()}`,
  seconds: `${date.getSeconds()}`,
  day: WEEK[date.getDay()],
  microsecond: date.getMilliseconds(),
});

//输出格式与时间的关联对象
const timeAssociatObject = value => {
  value = date2object(value);
  const { year, month, date, hours, minutes, seconds } = value;
  return {
    yyyy: year,
    yyy: year,
    yy: year.slice(Math.max(year.length - 2, 0)),
    mm: fillIn(month),
    m: month,
    dd: fillIn(date),
    d: date,
    HH: fillIn(hours),
    H: hours,
    MM: fillIn(minutes),
    M: minutes,
    SS: fillIn(seconds),
    S: seconds,
    w: value.day,
    s: value.microsecond,
  };
};

/** 
 * 格式化时间
 * @param {Date} date 进行格式的时间
 * @param {String} [specif=PATTERM_SPECIF] 将被格式的字符串
 * @return {String} 返回格式化后字符串
 */
export default (date, specif = PATTERM_SPECIF) => {
  const value = timeAssociatObject(date);
  return specif.replace(PATTERM_REGEX, $0 => $0 in value ? value[$0] : $0);
};
