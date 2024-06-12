import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  model,
  models,
  type Model,
} from 'mongoose';

const courseSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: String,
      required: false,
      ref: 'Category',
    },

    attachments: [
      {
        type: String,
        ref: 'Attachment',
        required: true,
      },
    ],
    chapters: [
      {
        type: String,
        ref: 'Chapter',
        required: true,
      },
    ],
    purchases: [{ type: String, ref: 'Purchase' }],
  },
  { timestamps: true },
);

export type ICourse = HydratedDocument<InferSchemaType<typeof courseSchema>>;

export const Course: Model<ICourse> =
  models?.Course || model('Course', courseSchema, 'courses');
export default Course;
