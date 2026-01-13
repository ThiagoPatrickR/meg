import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface SiteConfigAttributes {
    id: number;
    recipientName: string;
    street: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    deliveryNote: string | null;
    pixKey: string | null;
    pixKeyType: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface SiteConfigCreationAttributes extends Optional<SiteConfigAttributes, 'id' | 'complement' | 'deliveryNote' | 'pixKey' | 'pixKeyType'> { }

class SiteConfig extends Model<SiteConfigAttributes, SiteConfigCreationAttributes> implements SiteConfigAttributes {
    public id!: number;
    public recipientName!: string;
    public street!: string;
    public complement!: string | null;
    public neighborhood!: string;
    public city!: string;
    public state!: string;
    public zipCode!: string;
    public deliveryNote!: string | null;
    public pixKey!: string | null;
    public pixKeyType!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

SiteConfig.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        recipientName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'recipient_name',
        },
        street: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        complement: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        neighborhood: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(2),
            allowNull: false,
        },
        zipCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            field: 'zip_code',
        },
        deliveryNote: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'delivery_note',
        },
        pixKey: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'pix_key',
        },
        pixKeyType: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'pix_key_type',
        },
    },
    {
        sequelize,
        tableName: 'site_configs',
        modelName: 'SiteConfig',
    }
);

export default SiteConfig;

