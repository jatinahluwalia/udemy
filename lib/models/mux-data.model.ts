import {
  models,
  Document,
  model,
  Model,
  InferSchemaType,
  Schema,
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

export type IMuxData = Document & InferSchemaType<typeof muxDataSchema>;

const MuxData: Model<IMuxData> =
  models?.MuxData || model('MuxData', muxDataSchema, 'muxdata');

export default MuxData;
