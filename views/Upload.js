/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  Container,
  Content,
  Form,
  Button,
  Left,
  Right,
  ListItem,
  Radio,
} from 'native-base';
import {AsyncStorage, Image} from 'react-native';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHook';
import PropTypes from 'prop-types';
import * as DocumentPicker from 'expo-document-picker';
import * as Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {MediaContext} from '../contexts/MediaContext';


const Upload = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(false);
  const [radio3, setRadio3] = useState(false);
  const [type, setType] = useState({});
  const [file, setFile] = useState(null);

  const {inputs, handleTitleChange,
    handleDescChange, handleUpload, setInputs, loading} = useUploadForm();

  const upload = () => {
    handleUpload(file, props.navigation, setMedia, type);
    reset();
  };

  const reset = () => {
    setFile(null);
    setRadio1(false);
    setRadio2(false);
    setRadio3(false);
    setInputs('');
  };


  const AudioRadio = () => {
    if (radio1 == false) {
      setRadio1(true);
      setRadio2(false);
      setRadio3(false);
      setType('audio/mp3');
    } else {
      setRadio1(false);
      setType(null);
    }
  };
  const VideoRadio = () => {
    if (radio2 == false) {
      setRadio2(true);
      setRadio1(false);
      setRadio3(false);
      setType('video/mp4');
    } else {
      setRadio2(false);
      setType(null);
    }
  };
  const ImageRadio = () => {
    if (radio3 == false) {
      setRadio3(true);
      setRadio2(false);
      setRadio1(false);
      setType('image');
    } else {
      setRadio3(false);
      setType(null);
    }
  };

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const status = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      console.log(status + 'status');
      if (status !== 'granted') {
        alert('sorry blaablaa give permission');
      }
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
    });
    console.log(result);
    setFile(result);
  };
  useEffect(() => {
    getPermissionAsync();
  }, []);

  return (
    <Container>
      <Content>
        <Text>Upload</Text>

        <ListItem selected={radio1} onPress={AudioRadio}>
          <Left>
            <Text>Audio/mp3</Text>
          </Left>
          <Right>
            <Radio
              color={'#f0ad4e'}
              selectedColor={'#5cb85c'}
              selected={radio1}
            />
          </Right>
        </ListItem>
        <ListItem selected={radio2} onPress={VideoRadio} >
          <Left>
            <Text>Video</Text>
          </Left>
          <Right>
            <Radio
              color={'#f0ad4e'}
              selectedColor={'#5cb85c'}
              selected={radio2}
            />
          </Right>
        </ListItem>
        <ListItem selected={radio3} onPress={ImageRadio}>
          <Left>
            <Text>Image</Text>
          </Left>
          <Right>
            <Radio
              color={'#f0ad4e'}
              selectedColor={'#5cb85c'}
              selected={radio3}
            />
          </Right>
        </ListItem>
        <Image style ={{height: 100, width: 100}}
          source={file !== null && {uri: file.uri}}
        />
        <Form>
          <Button rounded light
            style={{padding: 10, alignSelf: 'center'}}
            onPress={pickFile}>
            <Text>Choose file</Text>
          </Button>

          <FormTextInput
            autoCapitalize='none'
            placeholder='Title'
            value={inputs.title}
            onChangeText={handleTitleChange}
          />
          {inputs.titleError !== undefined &&
          <Text>{inputs.titleError.title[0]}</Text>}
          <FormTextInput
            autoCapitalize='none'
            placeholder='Description'
            value={inputs.description}
            onChangeText={handleDescChange}
          />
          <Button
            title="send"
            onPress={upload}
          >
            <Text>Upload</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};
export default Upload;
