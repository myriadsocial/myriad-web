import MyriadAPI from './base';

export enum Kind {
  IMAGE = 'image',
  VIDEO = 'video',
}

export type UploadOptions = {
  onUploadProgress: (event: ProgressEvent) => void;
};

type FileUploaded = {
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
  url: string;
};

export type ResponseFileUpload = {
  files: FileUploaded[];
};

export const image = async (file: File, options: UploadOptions): Promise<ResponseFileUpload> => {
  const kind = Kind.IMAGE;

  const formData = new FormData();
  formData.append('file', file);

  const {data} = await MyriadAPI().request<ResponseFileUpload>({
    url: `/buckets/${kind}`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: options.onUploadProgress,
  });

  return data;
};

export const imageAsBuffer = async (
  file: Blob,
  options: UploadOptions,
): Promise<ResponseFileUpload> => {
  const kind = Kind.IMAGE;

  const formData = new FormData();
  formData.append('file', file);

  const {data} = await MyriadAPI().request<ResponseFileUpload>({
    url: `/buckets/${kind}`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: options.onUploadProgress,
  });

  return data;
};

export const video = async (file: File, options: UploadOptions): Promise<ResponseFileUpload> => {
  const kind = Kind.VIDEO;

  const formData = new FormData();
  formData.append('file', file);

  const {data} = await MyriadAPI().request<ResponseFileUpload>({
    url: `/buckets/${kind}`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: options.onUploadProgress,
  });

  return data;
};
