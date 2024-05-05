import {
  Document,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from 'mongoose';

const purchaseSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      ref: 'Course',
      required: true,
    },
  },
  { timestamps: true },
);

type IPurchase = Document & InferSchemaType<typeof purchaseSchema>;

const Purchase: Model<IPurchase> =
  models?.Purchase || model('Purchase', purchaseSchema, 'purchases');

export default Purchase;
