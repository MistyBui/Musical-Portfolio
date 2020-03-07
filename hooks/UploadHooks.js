import {useState} from 'react';
import validate from 'validate.js';
import validation from '../components/validation';
import {AsyncStorage} from 'react-native';
import {getAllMedia, getMediaByTag} from '../hooks/APIHook'

const useUploadForm = () => {

    const [inputs, setInputs] = useState({});

    
    const handleTitleChange = (text) => {
        const error = validate({title: inputs.title}, {title: validation.title});
        console.log(error);
      setInputs((inputs) =>
        ({
          ...inputs,
          title: text,
          titleError: error,
        }));
    };
    const handleDescChange = (text) => {
      setInputs((inputs) =>
        ({
          ...inputs,
          description: text,
        }));
    };

    const handleUpload = async (file, navigation, setMedia, type) => {
      try {
      console.log(file, type);

      
    const token = await AsyncStorage.getItem('userToken');
    console.log(token);

        let localUri = file.uri;
        let filename = file.name;

        let formData = new FormData();
        
  // Assume "photo" is the name of the form field the server expects
  formData.append('file', { uri: localUri, name: filename, type: type});
  formData.append('title', inputs.title);
  formData.append('description', inputs.description);

  console.log(formData);

      const response = await fetch('http://media.mw.metropolia.fi/wbma/media', {
        method: 'POST',
        headers: {
          'x-access-token' : token,
          'content-type': 'multipart/form-data',
      },
        body: formData,
      });
      const result = await response.json();
      console.log('result id', result.file_id);

      let tag = {file_id: result.file_id, tag: 'musicalportfolio'}

      const putTag = await fetch('http://media.mw.metropolia.fi/wbma/tags', {
        method: 'POST',
        headers: {
          'x-access-token' : token,
          'content-type': 'application/json',
      },
        body: JSON.stringify(tag),
      });
      const getTag = await putTag.json();
      console.log('tag', getTag);
      
      const newdata = await getMediaByTag();
      setMedia(newdata.reverse());
      navigation.push('Home');
  } catch(e){
      console.log(e);
    };

  };


    return {
      handleTitleChange,
      handleDescChange,
      inputs,
      handleUpload,
    };
  };







  export default useUploadForm;