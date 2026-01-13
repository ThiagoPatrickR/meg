import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';
import GiftCategory from './GiftCategory';

interface GiftAttributes {
    id: number;
    categoryId: number;
    title: string;
    image: string | null;
    price: number;
    purchaseLink: string | null;
    pixKey: string | null;
    purchased: boolean;
    purchasedBy: string | null;
    purchasedByEmail: string | null;
    purchasedAt: Date | null;
    paymentMethod: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface GiftCreationAttributes extends Optional<GiftAttributes, 'id' | 'image' | 'purchaseLink' | 'pixKey' | 'purchased' | 'purchasedBy' | 'purchasedByEmail' | 'purchasedAt' | 'paymentMethod'> { }

class Gift extends Model<GiftAttributes, GiftCreationAttributes> implements GiftAttributes {
    public id!: number;
    public categoryId!: number;
    public title!: string;
    public image!: string | null;
    public price!: number;
    public purchaseLink!: string | null;
    public pixKey!: string | null;
    public purchased!: boolean;
    public purchasedBy!: string | null;
    public purchasedByEmail!: string | null;
    public purchasedAt!: Date | null;
    public paymentMethod!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly category?: GiftCategory;
}

Gift.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'gift_categories',
                key: 'id',
            },
            field: 'category_id',
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        purchaseLink: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: 'purchase_link',
        },
        pixKey: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'pix_key',
        },
        purchased: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        purchasedBy: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'purchased_by',
        },
        purchasedByEmail: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'purchased_by_email',
        },
        purchasedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'purchased_at',
        },
        paymentMethod: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'payment_method',
        },
    },
    {
        sequelize,
        tableName: 'gifts',
        modelName: 'Gift',
    }
);

Gift.belongsTo(GiftCategory, { foreignKey: 'categoryId', as: 'category' });
GiftCategory.hasMany(Gift, { foreignKey: 'categoryId', as: 'gifts' });

export default Gift;
