// types.ts

// Тип действия (кормление, лечение и т.д.)
export enum ActionType {
	FEEDING = 'FEEDING',
	MEDICATION = 'MEDICATION',
	VACCINATION = 'VACCINATION',
	GROOMING = 'GROOMING',
	EXERCISE = 'EXERCISE',
	CHECKUP = 'CHECKUP',
	OTHER = 'OTHER',
}

// Человекочитаемые названия типов действий
export const ActionTypeLabels: Record<ActionType, string> = {
	[ActionType.FEEDING]: 'Кормление',
	[ActionType.MEDICATION]: 'Лечение',
	[ActionType.VACCINATION]: 'Вакцинация',
	[ActionType.GROOMING]: 'Уход',
	[ActionType.EXERCISE]: 'Физическая активность',
	[ActionType.CHECKUP]: 'Осмотр',
	[ActionType.OTHER]: 'Другое',
};

// Цвета для разных типов действий (для отображения в календаре)
export const ActionTypeColors: Record<ActionType, string> = {
	[ActionType.FEEDING]: '#52c41a', // Зеленый
	[ActionType.MEDICATION]: '#f5222d', // Красный
	[ActionType.VACCINATION]: '#1890ff', // Синий
	[ActionType.GROOMING]: '#722ed1', // Фиолетовый
	[ActionType.EXERCISE]: '#fa8c16', // Оранжевый
	[ActionType.CHECKUP]: '#13c2c2', // Бирюзовый
	[ActionType.OTHER]: '#8c8c8c', // Серый
};

// Запись о действии
export interface AnimalAction {
	id: string;
	animalId: string;
	animalName: string;
	actionType: ActionType;
	date: string; // ISO формат даты
	description: string;
	quantity?: string; // Количество (например, дозировка, порция)
	notes?: string; // Дополнительные заметки
	createdBy?: string; // Кто создал запись
	createdAt: string; // Когда была создана запись
}

// Животное
export interface Animal {
	id: string;
	name: string;
	species: string; // Вид животного
	breed?: string; // Порода
	age?: number; // Возраст
	weight?: number; // Вес
	photo?: string; // URL фото
}
