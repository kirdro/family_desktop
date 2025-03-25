import styled from 'styled-components';
import { Button, Card, Typography } from 'antd';
const { Text } = Typography;

export const Container = styled.div`
	padding: 24px;
`;

export const StyledCard = styled(Card)`
	background: #1f1f1f;
	border-radius: 8px;
	margin-bottom: 16px;
`;

export const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
`;

export const ActionButtonsContainer = styled.div`
	display: flex;
	gap: 12px;
`;

export const TagContainer = styled.div`
	margin-top: 16px;
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
`;

export const FileItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px;
	background: #2a2a2a;
	border-radius: 4px;
	margin-bottom: 8px;
`;

export const UploadContainer = styled.div`
	margin-bottom: 24px;
`;

export const PreviewFilesSection = styled.div`
	margin-top: 16px;
	margin-bottom: 24px;
`;

export const PreviewFileItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px;
	background: #2a2a2a;
	border-radius: 4px;
	margin-bottom: 8px;
	border: 1px dashed #444;
`;

export const UploadActionsSection = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 16px;
	gap: 12px;
`;

export const PreviewThumbnail = styled.div`
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	margin-right: 12px;
`;

export const PreviewActions = styled.div`
	display: flex;
	gap: 8px;
`;

export const TaskItem = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 12px;
	background: #2a2a2a;
	border-radius: 4px;
	margin-bottom: 8px;
	transition: background-color 0.3s;

	&:hover {
		background: #303030;
	}
`;

export const TaskTitle = styled(Text)`
	font-size: 16px;
	margin-left: 8px;
	display: inline-block;
	text-decoration: ${(props) => (props.delete ? 'line-through' : 'none')};
	color: ${(props) => (props.delete ? '#8c8c8c' : 'inherit')};
`;

export const TaskContent = styled.div`
	display: flex;
	align-items: flex-start;
	flex: 1;
`;

export const TaskActions = styled.div`
	display: flex;
	gap: 8px;
`;

export const TaskModalContent = styled.div`
	max-height: 70vh;
	overflow-y: auto;
	padding-right: 8px;
`;

export const TaskModalHeader = styled.div`
	margin-bottom: 16px;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
`;

export const TaskModalSection = styled.div`
	margin-bottom: 16px;
`;

export const SubTaskList = styled.div`
	margin-top: 16px;
`;

export const SubTaskItem = styled.div`
	padding: 8px;
	margin-bottom: 8px;
	background: #303030;
	border-radius: 4px;
	display: flex;
	align-items: center;
`;

export const CommentSection = styled.div`
	margin-top: 16px;
`;

export const TaskInfoItem = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
`;

export const DueDate = styled(Text)<{
	overdue: boolean | undefined;
}>`
	color: ${(props) => (props.overdue ? '#ff4d4f' : 'inherit')};
`;

export const AddTaskButton = styled(Button)`
	margin-bottom: 16px;
`;
