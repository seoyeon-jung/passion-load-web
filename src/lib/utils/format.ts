import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export const formatDate = (date: string | Date, format = 'YYYY.MM.DD') =>
  dayjs(date).format(format);

export const formatDateWithDay = (date: string | Date) =>
  dayjs(date).format('YYYY.MM.DD (ddd)');

export const formatMonth = (date: string | Date) =>
  dayjs(date).format('YYYY.MM');

export const startOfMonth = (date: string | Date) =>
  dayjs(date).startOf('month').format('YYYY-MM-DD');

export const endOfMonth = (date: string | Date) =>
  dayjs(date).endOf('month').format('YYYY-MM-DD');

export const today = () => dayjs().format('YYYY-MM-DD');

export const isSameDay = (a: string | Date, b: string | Date) =>
  dayjs(a).isSame(dayjs(b), 'day');