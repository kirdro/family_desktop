import dayjs from 'dayjs';

export const formatDate = (
	date: string | Date | undefined,
	format = 'DD.MM.YYYY HH:mm',
) => {
	if (!date) return '—';
	return dayjs(date).format(format);
};
