import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';

interface RSVPAttributes {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    confirmed: boolean;
    guests: number;
    message: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface RSVPCreationAttributes extends Optional<RSVPAttributes, 'id' | 'phone' | 'email' | 'confirmed' | 'guests' | 'message'> { }

class RSVP extends Model<RSVPAttributes, RSVPCreationAttributes> implements RSVPAttributes {
    public id!: number;
    public name!: string;
    public phone!: string | null;
    public email!: string | null;
    public confirmed!: boolean;
    public guests!: number;
    public message!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

RSVP.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        confirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        guests: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'rsvps',
        modelName: 'RSVP',
    }
);

export default RSVP;
