import {
  HydratedDocument,
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from 'mongoose';
const muxDataSchema = new Schema({
  chapterId: {
    type: String,
    ref: 'Chapter',
    unique: true,
    required: true,
  },
  assetId: {
    type: String,
    required: true,
  },
  playbackId: String,
});

export type IMuxData = HydratedDocument<InferSchemaType<typeof muxDataSchema>>;

const MuxData: Model<IMuxData> =
  models?.MuxData || model('MuxData', muxDataSchema, 'muxdata');

export default MuxData;
