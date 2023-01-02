import {UploadAdapter} from './upload';

export const CustomAdapterPlugin = editor => {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    loader.on('change:status', (evt, name, value, oldValue) => {
      // code
    });

    return new UploadAdapter(loader);
  };
};
