// AnimalsList.tsx
import React, { useState, useEffect } from 'react';
import {
	Card,
	List,
	Avatar,
	Button,
	Typography,
	Tag,
	Space,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	Upload,
	message,
	Popconfirm,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	UploadOutlined,
	UserOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import styled from 'styled-components';
import { Animal } from '../../types/animal';

const { Title, Text } = Typography;
const { Option } = Select;

const Container = styled.div`
	padding: 20px;
`;

const AnimalCard = styled(Card)`
	margin-bottom: 16px;
	border-radius: 8px;
	overflow: hidden;
	transition: all 0.3s;

	&:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
`;

const AnimalAvatar = styled(Avatar)`
	width: 80px;
	height: 80px;
`;

const AnimalName = styled(Title)`
	margin-bottom: 6px !important;
`;

const AnimalDetails = styled.div`
	margin-top: 8px;
`;

const SpeciesTag = styled(Tag)`
	margin-right: 8px;
`;

// Заглушка для начальных данных о животных
const initialAnimals: Animal[] = [
	{
		id: '1',
		name: 'Барсик',
		species: 'Кот',
		breed: 'Сиамский',
		age: 3,
		weight: 4.5,
	},
	{
		id: '2',
		name: 'Шарик',
		species: 'Собака',
		breed: 'Лабрадор',
		age: 5,
		weight: 30,
	},
	{
		id: '3',
		name: 'Хрюша',
		species: 'Свинья',
		breed: 'Мини-пиг',
		age: 1,
		weight: 15,
	},
	{
		id: '4',
		name: 'Кеша',
		species: 'Попугай',
		breed: 'Волнистый',
		age: 2,
		weight: 0.1,
	},
];

// Варианты видов животных
const speciesOptions = [
	'Кот',
	'Собака',
	'Корова',
	'Свинья',
	'Лошадь',
	'Коза',
	'Овца',
	'Кролик',
	'Курица',
	'Попугай',
	'Хомяк',
	'Морская свинка',
	'Другое',
];

const AnimalsList: React.FC = () => {
	const [animals, setAnimals] = useState<Animal[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	// Загрузка данных
	useEffect(() => {
		setAnimals(initialAnimals);
	}, []);

	// Открыть модальное окно для создания нового животного
	const handleAddAnimal = () => {
		setEditingAnimal(null);
		form.resetFields();
		setFileList([]);
		setModalVisible(true);
	};

	// Открыть модальное окно для редактирования животного
	const handleEditAnimal = (animal: Animal) => {
		setEditingAnimal(animal);
		form.setFieldsValue({
			name: animal.name,
			species: animal.species,
			breed: animal.breed,
			age: animal.age,
			weight: animal.weight,
		});

		setFileList(
			animal.photo ?
				[
					{
						uid: '-1',
						name: 'photo.png',
						status: 'done',
						url: animal.photo,
					},
				]
			:	[],
		);

		setModalVisible(true);
	};

	// Удаление животного
	const handleDeleteAnimal = (animalId: string) => {
		setAnimals((prevAnimals) =>
			prevAnimals.filter((animal) => animal.id !== animalId),
		);
		message.success('Животное удалено');
	};

	// Сохранение животного
	const handleSaveAnimal = (values: any) => {
		const photoUrl =
			fileList.length > 0 && fileList[0].url ?
				fileList[0].url
			:	editingAnimal?.photo || undefined;

		const animalData: Animal = {
			id: editingAnimal ? editingAnimal.id : `animal-${Date.now()}`,
			name: values.name,
			species: values.species,
			breed: values.breed,
			age: values.age,
			weight: values.weight,
			photo: photoUrl,
		};

		if (editingAnimal) {
			// Обновляем существующее животное
			setAnimals((prevAnimals) =>
				prevAnimals.map((animal) =>
					animal.id === editingAnimal.id ? animalData : animal,
				),
			);
			message.success('Данные о животном обновлены');
		} else {
			// Создаем новое животное
			setAnimals((prevAnimals) => [...prevAnimals, animalData]);
			message.success('Животное добавлено');
		}

		setModalVisible(false);
	};

	// Обработчик изменения списка файлов
	const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
		setFileList(fileList);
	};

	// Обработчик предпросмотра изображения
	const beforeUpload = (file: File) => {
		const isJpgOrPng =
			file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('Можно загружать только JPG/PNG файлы!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Изображение должно быть меньше 2MB!');
		}
		return false;
	};

	return (
		<Container>
			<Card title='Животные'>
				<div style={{ marginBottom: 16, textAlign: 'right' }}>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={handleAddAnimal}
					>
						Добавить животное
					</Button>
				</div>

				<List
					grid={{
						gutter: 16,
						xs: 1,
						sm: 2,
						md: 3,
						lg: 3,
						xl: 4,
						xxl: 4,
					}}
					dataSource={animals}
					renderItem={(animal) => (
						<List.Item>
							<AnimalCard
								actions={[
									<Button
										icon={<EditOutlined />}
										type='text'
										onClick={() => handleEditAnimal(animal)}
									>
										Редактировать
									</Button>,
									<Popconfirm
										title='Вы уверены, что хотите удалить это животное?'
										onConfirm={() =>
											handleDeleteAnimal(animal.id)
										}
										okText='Да'
										cancelText='Нет'
									>
										<Button
											icon={<DeleteOutlined />}
											type='text'
											danger
										>
											Удалить
										</Button>
									</Popconfirm>,
								]}
							>
								<Card.Meta
									avatar={
										<AnimalAvatar
											src={animal.photo}
											icon={
												!animal.photo && (
													<UserOutlined />
												)
											}
										/>
									}
									title={
										<AnimalName level={4}>
											{animal.name}
										</AnimalName>
									}
									description={
										<AnimalDetails>
											<div>
												<SpeciesTag color='blue'>
													{animal.species}
												</SpeciesTag>
												{animal.breed && (
													<SpeciesTag>
														{animal.breed}
													</SpeciesTag>
												)}
											</div>
											<div style={{ marginTop: 8 }}>
												{animal.age && (
													<Text
														style={{
															marginRight: 12,
														}}
													>
														Возраст: {animal.age}{' '}
														{getPluralForm(
															animal.age,
															[
																'год',
																'года',
																'лет',
															],
														)}
													</Text>
												)}
												{animal.weight && (
													<Text>
														Вес: {animal.weight} кг
													</Text>
												)}
											</div>
										</AnimalDetails>
									}
								/>
							</AnimalCard>
						</List.Item>
					)}
				/>
			</Card>

			{/* Модальное окно для добавления/редактирования животного */}
			<Modal
				title={
					editingAnimal ?
						'Редактировать данные животного'
					:	'Добавить новое животное'
				}
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				footer={null}
				width={600}
			>
				<Form form={form} layout='vertical' onFinish={handleSaveAnimal}>
					<Form.Item
						name='name'
						label='Кличка'
						rules={[
							{
								required: true,
								message: 'Пожалуйста, введите кличку животного',
							},
						]}
					>
						<Input placeholder='Введите кличку животного' />
					</Form.Item>

					<div style={{ display: 'flex', gap: 16 }}>
						<Form.Item
							name='species'
							label='Вид животного'
							rules={[
								{
									required: true,
									message:
										'Пожалуйста, выберите вид животного',
								},
							]}
							style={{ flex: 1 }}
						>
							<Select placeholder='Выберите вид животного'>
								{speciesOptions.map((species) => (
									<Option key={species} value={species}>
										{species}
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							name='breed'
							label='Порода'
							style={{ flex: 1 }}
						>
							<Input placeholder='Порода (если известна)' />
						</Form.Item>
					</div>

					<div style={{ display: 'flex', gap: 16 }}>
						<Form.Item
							name='age'
							label='Возраст (лет)'
							style={{ flex: 1 }}
						>
							<InputNumber
								placeholder='Возраст'
								min={0}
								max={100}
								style={{ width: '100%' }}
							/>
						</Form.Item>

						<Form.Item
							name='weight'
							label='Вес (кг)'
							style={{ flex: 1 }}
						>
							<InputNumber
								placeholder='Вес'
								min={0}
								max={1000}
								step={0.1}
								precision={1}
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</div>

					<Form.Item label='Фотография' name='photo'>
						<Upload
							listType='picture-card'
							fileList={fileList}
							beforeUpload={beforeUpload}
							onChange={handleFileChange}
							maxCount={1}
							accept='image/*'
						>
							{fileList.length < 1 && (
								<div>
									<UploadOutlined />
									<div style={{ marginTop: 8 }}>
										Загрузить
									</div>
								</div>
							)}
						</Upload>
						<Text type='secondary'>
							Поддерживаются JPG/PNG файлы размером до 2MB
						</Text>
					</Form.Item>

					<Form.Item
						style={{
							textAlign: 'right',
							marginBottom: 0,
							marginTop: 16,
						}}
					>
						<Space>
							<Button onClick={() => setModalVisible(false)}>
								Отмена
							</Button>
							<Button type='primary' htmlType='submit'>
								{editingAnimal ?
									'Сохранить изменения'
								:	'Добавить животное'}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</Container>
	);
};

// Вспомогательная функция для склонения слов в зависимости от числа
function getPluralForm(
	number: number,
	forms: [string, string, string],
): string {
	let n = Math.abs(number) % 100;
	if (n >= 5 && n <= 20) {
		return forms[2];
	}
	n = n % 10;
	if (n === 1) {
		return forms[0];
	}
	if (n >= 2 && n <= 4) {
		return forms[1];
	}
	return forms[2];
}

export default AnimalsList;
