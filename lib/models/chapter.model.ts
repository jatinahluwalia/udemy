import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from 'mongoose';

const chapterSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    videoUrl: String,
    position: {
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: String,
      ref: 'Course',
    },
    muxData: {
      type: String,
      ref: 'MuxData',
    },
    userProgress: [
      {
        type: String,
        required: true,
        ref: 'UserProgress',
      },
    ],
  },
  { timestamps: true },
);

export type IChapter = HydratedDocument<InferSchemaType<typeof chapterSchema>>;

const Chapter: Model<IChapter> =
  models?.Chapter || model('Chapter', chapterSchema, 'chapters');

export default Chapter;
