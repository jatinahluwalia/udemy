import { InferSchemaType, Model, Schema, model, models } from 'mongoose';

const catgeorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  courses: [{ type: String, ref: 'Course', required: true }],
});

export type ICatgeory = Document & InferSchemaType<typeof catgeorySchema>;
export const Category: Model<ICatgeory> =
  models?.Category || model('Category', catgeorySchema, 'categories');
export default Category;
