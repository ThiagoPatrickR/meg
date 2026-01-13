import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface ChatConfigAttributes {
    id: number;
    systemPrompt: string;
    weddingInfo: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ChatConfigCreationAttributes extends Optional<ChatConfigAttributes, 'id' | 'active'> { }

class ChatConfig extends Model<ChatConfigAttributes, ChatConfigCreationAttributes> implements ChatConfigAttributes {
    public id!: number;
    public systemPrompt!: string;
    public weddingInfo!: string;
    public active!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ChatConfig.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        systemPrompt: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'system_prompt',
        },
        weddingInfo: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'wedding_info',
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'chat_configs',
        modelName: 'ChatConfig',
    }
);

export default ChatConfig;
