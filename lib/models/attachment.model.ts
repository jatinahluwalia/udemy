import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from 'mongoose';

const attachmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: { type: String, required: true },
    courseId: {
      type: String,
      required: true,
      ref: 'Attachment',
    },
  },
  { timestamps: true },
);

export type IAttachment = HydratedDocument<
  InferSchemaType<typeof attachmentSchema>
>;

export const Attachment: Model<IAttachment> =
  models?.Attachment || model('Attachment', attachmentSchema, 'attachments');
export default Attachment;
