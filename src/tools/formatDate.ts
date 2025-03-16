import dayjs from 'dayjs';

export const formatDate = (
	date: string | null | undefined | Date,
	format: string,
) => {
	if (!date) return '-';
	return dayjs(date).format(format || 'DD.MM.YYYY');
};
