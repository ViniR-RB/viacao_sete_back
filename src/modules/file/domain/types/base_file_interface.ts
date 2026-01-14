export default interface BaseFileInterface {
  originalName: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
  encoding?: string;
}
