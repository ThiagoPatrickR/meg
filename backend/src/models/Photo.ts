import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface PhotoAttributes {
    id: number;
    title: string | null;
    image: string;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface PhotoCreationAttributes extends Optional<PhotoAttributes, 'id' | 'title' | 'order'> { }

class Photo extends Model<PhotoAttributes, PhotoCreationAttributes> implements PhotoAttributes {
    public id!: number;
    public title!: string | null;
    public image!: string;
    public order!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Photo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'photos',
        modelName: 'Photo',
    }
);

export default Photo;
