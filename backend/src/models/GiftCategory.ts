import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface GiftCategoryAttributes {
    id: number;
    name: string;
    icon: string;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface GiftCategoryCreationAttributes extends Optional<GiftCategoryAttributes, 'id' | 'order'> { }

class GiftCategory extends Model<GiftCategoryAttributes, GiftCategoryCreationAttributes> implements GiftCategoryAttributes {
    public id!: number;
    public name!: string;
    public icon!: string;
    public order!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

GiftCategory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: '🎁',
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'gift_categories',
        modelName: 'GiftCategory',
    }
);

export default GiftCategory;
