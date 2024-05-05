import {
  Document,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from 'mongoose';

const stripeCustomerSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    stripeCustomerId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);

type IStripeCustomer = Document & InferSchemaType<typeof stripeCustomerSchema>;

const StripeCustomer: Model<IStripeCustomer> =
  models?.StripeCustomer ||
  model('StripeCustomer', stripeCustomerSchema, 'stripecustomers');

export default StripeCustomer;
