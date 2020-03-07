import {useState} from 'react';
import validate from 'validate.js';
import {uploadConstraints} from '../constants/validationConst';
import {AsyncStorage} from 'react-native';
import {fetchFormData, getAllMedia} from './APIHook';

const useUploadForm = () => {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);


  const handleTitleChange = (text) => {
    const error = validate({title: inputs.title},
        {title: uploadConstraints.title});
    console.log(error);
    setInputs((inputs) =>
      ({
        ...inputs,
        title: text,
        titleError: error,
      }));
  };
  const handleDescChange = (text) => {
    const error = validate({description: inputs.description},
        {description: uploadConstraints.description});
    setInputs((inputs) =>
      ({
        ...inputs,
        description: text,
        descriptionError: error,
      }));
  };

  const handleUpload = async (file, navigation, setMedia, type) => {
    const filename = file.uri.split('/').pop();

    const fd = new FormData();
    fd.append('title', inputs.title);
    fd.append('description', inputs.description);
    fd.append('file', {uri: file.uri, name: filename, type});

    console.log('FD:', fd);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const resp = await fetchFormData('media', fd, token);
      console.log('upl resp', resp);
      if (resp.message == 'File uploaded') {
        const data = getAllMedia();
        setMedia(data);
        setLoading(false);
        navigation.push('Home');
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return {
    handleTitleChange,
    handleDescChange,
    inputs,
    loading,
    handleUpload,
    setInputs,
  };
};

export default useUploadForm;
