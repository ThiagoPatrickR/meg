import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface MessageAttributes {
    id: number;
    authorName: string;
    authorType: 'friend' | 'family' | 'godparent';
    content: string;
    approved: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'approved'> { }

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    public id!: number;
    public authorName!: string;
    public authorType!: 'friend' | 'family' | 'godparent';
    public content!: string;
    public approved!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        authorName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'author_name',
        },
        authorType: {
            type: DataTypes.ENUM('friend', 'family', 'godparent'),
            allowNull: false,
            defaultValue: 'friend',
            field: 'author_type',
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'messages',
        modelName: 'Message',
    }
);

export default Message;
