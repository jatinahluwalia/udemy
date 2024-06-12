import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from 'mongoose';

const userProgessSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chapterId: {
      type: String,
      ref: 'Chapter',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userProgessSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

export type IUserProgress = HydratedDocument<
  InferSchemaType<typeof userProgessSchema>
>;

const UserProgress: Model<IUserProgress> =
  models?.UserProgress ||
  model('UserProgress', userProgessSchema, 'userprogress');

export default UserProgress;
