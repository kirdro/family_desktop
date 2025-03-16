// dateUtils.ts
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
dayjs.locale('ru');

export const formatDate = (date: string | Date) => {
	return dayjs(date).format('DD.MM.YYYY');
};

export const formatDateTime = (date: string | Date) => {
	return dayjs(date).format('DD.MM.YYYY HH:mm');
};

export const getRelativeTime = (date: string | Date) => {
	return dayjs(date).fromNow();
};

export const getDaysLeft = (endDate: string | Date) => {
	return dayjs(endDate).diff(dayjs(), 'day');
};

export const isOverdue = (endDate: string | Date) => {
	return getDaysLeft(endDate) < 0;
};
