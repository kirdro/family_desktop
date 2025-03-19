import React from 'react';
import { Avatar, Tooltip, theme } from 'antd';

interface UserAvatarProps {
    name: string;
    email?: string;
    avatar?: string;
    size?: number | 'large' | 'small' | 'default';
    style?: React.CSSProperties;
    className?: string;
    showTooltip?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
                                                   name,
                                                   email,
                                                   avatar,
                                                   size = 'default',
                                                   style,
                                                   className,
                                                   showTooltip = true,
                                               }) => {
    const { token } = theme.useToken();

    // Получаем инициалы
    const getInitials = () => {
        if (name) {
            // Разбиваем имя на части и берем первые буквы
            return name
                .split(' ')
                .map((part) => part && part[0])
                .filter(Boolean) // Удаляем пустые элементы
                .join('')
                .toUpperCase()
                .substring(0, 2); // Максимум 2 буквы
        } else if (email) {
            // Берем первую букву из email
            return email[0].toUpperCase();
        }
        return '?'; // Если нет ни имени, ни email
    };

    // Генерируем цвет
    const getColorFromName = () => {
        const colors = [
            '#1890ff', '#52c41a', '#faad14', '#f5222d',
            '#722ed1', '#13c2c2', '#fa8c16', '#eb2f96',
        ];

        const str = name || email || '';
        const stringToHash = (s: string) => {
            let hash = 0;
            for (let i = 0; i < s.length; i++) {
                hash = (hash << 5) - hash + s.charCodeAt(i);
                hash = hash & hash;
            }
            return Math.abs(hash);
        };

        const hashValue = stringToHash(str);
        return colors[hashValue % colors.length];
    };

    // Создаем компонент аватара
    const avatarComponent = avatar ? (
        <Avatar
            src={avatar}
            size={size}
            style={style}
            className={className}
        />
    ) : (
        <Avatar
            size={size}
            style={{
                backgroundColor: getColorFromName(),
                color: token.colorTextLightSolid,
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...style
            }}
            className={className}
        >
            {getInitials()}
        </Avatar>
    );

    // Оборачиваем в Tooltip, если нужно
    return showTooltip ? (
        <Tooltip title={name || email}>
            {avatarComponent}
        </Tooltip>
    ) : (
        avatarComponent
    );
};

export default UserAvatar;