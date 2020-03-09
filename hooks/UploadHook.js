/* eslint-disable linebreak-style */
import {useState} from 'react';
import {AsyncStorage} from 'react-native';
import {getMediaByTag, getUserMedia, fetchPOST, fetchPUT,
  fetchFormData, getCurrentUser} from '../hooks/APIHook';

const useUploadForm = () => {
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        title: text,
      }));
  };

  const handleDescChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        description: text,
      }));
  };

  const handleModify = async (id, navigation, setMedia) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('1: ', id);
      console.log('2: ', inputs);
      console.log('3: ', token);
      const resp = await fetchPUT('media', id, inputs, token);

      console.log('upl resp', resp);

      if (resp.message) {
        const data = await getUserMedia(token);
        setMedia((media) =>
          ({
            ...media,
            myFiles: data,
          }));
        setLoading(false);
        navigation.pop();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleUpload = async (file, navigation, setMedia, type) => {
    try {
      console.log(file, type);
      const token = await AsyncStorage.getItem('userToken');
      console.log(token);
      const localUri = file.uri;
      const filename = file.name;
      const formData = new FormData();

      // Assume "photo" is the name of the form field the server expects
      formData.append('file', {uri: localUri, name: filename, type: type});
      formData.append('title', inputs.title);
      formData.append('description', inputs.description);

      console.log(formData);

      const response = await fetch('http://media.mw.metropolia.fi/wbma/media', {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'content-type': 'multipart/form-data',
        },
        body: formData,
      });
      const result = await response.json();
      console.log('result id', result.file_id);

      const tag = {file_id: result.file_id, tag: 'musicalportfolio'};

      const putTag = await fetch('http://media.mw.metropolia.fi/wbma/tags', {
        method: 'POST',
        headers: {
          'x-access-token': token,
          'content-type': 'application/json',
        },
        body: JSON.stringify(tag),
      });
      const getTag = await putTag.json();
      console.log('tag', getTag);

      const newdata = await getMediaByTag();
      setMedia(newdata.reverse());
      navigation.push('Home');
    } catch (e) {
      console.log(e);
    }
  };

  const handleAvatar = async (file) => {
    const filename = file.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    // fix jpg mimetype
    if (type === 'image/jpg') {
      type = 'image/jpeg';
    }
    const fd = new FormData();
    fd.append('file', {uri: file.uri, name: filename, type});
    console.log('FD:', fd);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await getCurrentUser();
      const resp = await fetchFormData('media', fd, token);
      console.log('upl resp', resp);
      if (resp.message =='File uploaded') {
        const tag = {file_id: resp.file_id, tag: 'avatar_' + user.user_id};
        const tagFile = await fetchPOST('tags', tag, token);
        console.log('tag', tagFile);
        if (tagFile.message=='Tag added') {
          alert('Update success. Please log out');
        } else {
          alert('Update failed. Contact admin');
        }
      } else {
        alert('Upload failed');
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return {
    handleTitleChange,
    handleDescChange,
    handleModify,
    inputs,
    handleUpload,
    setInputs,
    handleAvatar,
    loading,
  };
};

export default useUploadForm;
