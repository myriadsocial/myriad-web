import axios, {CancelTokenSource} from 'axios';
import MyriadAPI from 'src/lib/api/base';
import {Kind, ResponseFileUpload} from 'src/lib/api/upload';

export class UploadAdapter {
  protected loader: any;
  protected source: CancelTokenSource;

  constructor(props) {
    // CKEditor 5's FileLoader instance.
    this.loader = props;
  }

  // Starts the upload process.
  upload() {
    const CancelToken = axios.CancelToken;

    this.source = CancelToken.source();
    this.loader.uploaded = 0;
    this.loader.uploadTotal = 0;

    return new Promise((resolve, reject) => {
      this.loader.file.then(async result => {
        const kind = Kind.IMAGE;
        const formData = new FormData();
        formData.append('file', result);

        MyriadAPI()
          .request<ResponseFileUpload>({
            url: `/buckets/${kind}`,
            method: 'POST',
            cancelToken: this.source.token,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: formData,
          })
          .then(({data}) => {
            this.loader.uploaded = 1;
            this.loader.uploadTotal = 1;

            resolve({
              default: data.files[0].url,
            });
          })
          .catch(() => {
            reject({
              error: {
                message: 'The image upload failed',
              },
            });
          });
      });
    });
  }

  // Aborts the upload process.
  abort() {
    if (this.source) {
      this.source.cancel();
    }
  }
}
