import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database';
import Gift from './Gift';

interface PaymentAttributes {
    id: number;
    giftId: number;
    mpPaymentId: string | null;
    payerEmail: string | null;
    payerName: string | null;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    paymentMethod: 'pix' | 'card' | 'external';
    pixQrCode: string | null;
    pixQrCodeBase64: string | null;
    receiptUrl: string | null;
    invoiceSlug: string | null;
    transactionId: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'mpPaymentId' | 'payerEmail' | 'payerName' | 'status' | 'pixQrCode' | 'pixQrCodeBase64'> { }

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    public id!: number;
    public giftId!: number;
    public mpPaymentId!: string | null;
    public payerEmail!: string | null;
    public payerName!: string | null;
    public amount!: number;
    public status!: 'pending' | 'approved' | 'rejected' | 'cancelled';
    public paymentMethod!: 'pix' | 'card' | 'external';
    public pixQrCode!: string | null;
    public pixQrCodeBase64!: string | null;
    public receiptUrl!: string | null;
    public invoiceSlug!: string | null;
    public transactionId!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly gift?: Gift;
}

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        giftId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'gifts',
                key: 'id',
            },
            field: 'gift_id',
        },
        mpPaymentId: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'mp_payment_id',
        },
        payerEmail: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'payer_email',
        },
        payerName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'payer_name',
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        paymentMethod: {
            type: DataTypes.ENUM('pix', 'card', 'external'),
            allowNull: false,
            field: 'payment_method',
        },
        pixQrCode: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'pix_qr_code',
        },
        pixQrCodeBase64: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'pix_qr_code_base64',
        },
        receiptUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: 'receipt_url',
        },
        invoiceSlug: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'invoice_slug',
        },
        transactionId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'transaction_id',
        },
    },
    {
        sequelize,
        tableName: 'payments',
        modelName: 'Payment',
    }
);

Payment.belongsTo(Gift, { foreignKey: 'giftId', as: 'gift' });
Gift.hasMany(Payment, { foreignKey: 'giftId', as: 'payments' });

export default Payment;
