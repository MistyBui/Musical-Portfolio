/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import React, {useState, useContext} from 'react';
import {Text, Container, Content, Form,
  Button, Left, Right, ListItem, Radio, H1} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHook';
import * as DocumentPicker from 'expo-document-picker';
import {MediaContext} from '../contexts/MediaContext';

const Upload = (props) => {
  const {media, setMedia} = useContext(MediaContext);
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(false);
  const [type, setType] = useState({});
  const [file, setFile] = useState(null);
  const {inputs, handleTitleChange,
    handleDescChange, handleUpload, setInputs} = useUploadForm();

  const AudioRadio = () => {
    if (radio1 == false) {
      setRadio1(true);
      setRadio2(false);
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
      setType('video/mp4');
    } else {
      setRadio2(false);
      setType(null);
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
    });
    console.log(result);
    setFile(result);
  };

  const upload = () => {
    handleUpload(file, props.navigation, setMedia, type);
    reset();
  };

  const reset = () => {
    setFile('');
    setRadio1(false);
    setRadio2(false);
    setInputs('');
  };

  return (

    <Container>
      <Content>
        <H1 style={{padding: 10, alignSelf: 'center'}}>Upload</H1>

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
        <Form>

          <Button rounded light
            style={{padding: 10, alignSelf: 'center'}}
            onPress={pickFile}>
            <Text>Choose file</Text>
          </Button>

          <FormTextInput
            autoCapitalize='none'
            placeholder='Enter title'
            value={inputs.title}
            onChangeText={handleTitleChange}
          />
          {inputs.titleError !== undefined &&
            <Text>{inputs.titleError.title[0]}</Text>}
          <FormTextInput
            autoCapitalize='none'
            placeholder='Enter description'
            value={inputs.description}
            onChangeText={handleDescChange}
          />
          <Button rounded
            title="Upload"
            style={{padding: 10, alignSelf: 'center'}}
            onPress={upload}
          >
            <Text>Upload</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
};
export default Upload;
