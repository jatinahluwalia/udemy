import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  courses: [{ type: String, ref: 'Course', required: true }],
});

export type ICategory = HydratedDocument<
  InferSchemaType<typeof categorySchema>
>;
export const Category: Model<ICategory> =
  models?.Category || model('Category', categorySchema, 'categories');
export default Category;
