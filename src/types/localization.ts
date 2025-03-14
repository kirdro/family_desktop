export interface MonthsType {
	january: string;
	february: string;
	march: string;
	april: string;
	may: string;
	june: string;
	july: string;
	august: string;
	september: string;
	october: string;
	november: string;
	december: string;
}

export interface DaysType {
	monday: string;
	tuesday: string;
	wednesday: string;
	thursday: string;
	friday: string;
	saturday: string;
	sunday: string;
}

export interface TranslationsType {
	save: string;
	selectSingle: string;
	selectMultiple: string;
	selectRange: string;
	notAccordingToDateFormat: (inputFormat: string) => string;
	mustBeHigherThan: (date: string) => string;
	mustBeLowerThan: (date: string) => string;
	mustBeBetween: (startDate: string, endDate: string) => string;
	dateIsDisabled: string;
	previous: string;
	next: string;
	typeInDate: string;
	pickDateFromCalendar: string;
	close: string;
	hour: string;
	minute: string;
	am: string;
	pm: string;
	months: MonthsType;
	monthsShort: MonthsType;
	days: DaysType;
	daysShort: DaysType;
}