/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';
import {Text, Container, Content, Form,
  Button, Left, Right, ListItem, H1, H6} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHook';
import {validateField} from '../utils/validation';
import {MediaContext} from '../contexts/MediaContext';
import PropTypes from 'prop-types';

import {mediaURL} from '../constants/urlConst';
import {Video} from 'expo-av';
import {Dimensions} from 'react-native';
const deviceHeight = Dimensions.get('window').height;


const Modify = (props) => {
  const {navigation} = props;
  const {media, setMedia} = useContext(MediaContext);
  const [send, setSend] = useState(false);

  const {inputs, handleTitleChange,
    handleDescChange, handleUpload,
    setInputs, handleModify, errors} = useUploadForm();

  const validationProperties = {
    title: {title: inputs.title},
    description: {description: inputs.description},
  };

  const validate = (field, value) => {
    console.log('vp', validationProperties[field]);
  };

  const file = props.navigation.state.params.file;

  useEffect(() => {
    setInputs((inputs) =>
      ({
        ...inputs,
        title: file.title,
        description: file.description,
      }));
  }, []);

  const handleTitle = (text) => {
    handleTitleChange(text);
    validate('title', text);
  };

  const handleDesc = (text) => {
    handleDescChange(text);
    validate('description', text);
  };

  const modify = () => {
    console.log('modifying file...');
    handleModify(file.file_id, props.navigation, setMedia);
  };

  return (
    <Container>
      <Content
        style={{margin: 25}}>

        <Form>
          <Text style={{fontSize: 20}}>Insert new information: </Text>

          <FormTextInput
            autoCapitalize='none'
            placeholder='Enter new title'
            value={inputs.title}
            onChangeText={handleTitleChange}
          />
          {inputs.titleError !== undefined &&
            <Text>{inputs.titleError.title[0]}</Text>}
          <FormTextInput
            autoCapitalize='none'
            placeholder='Enter new description'
            value={inputs.description}
            onChangeText={handleDesc}
          />
          <Button rounded
            title="Edit"
            style={{padding: 10, alignSelf: 'center'}}
            onPress={modify}
          >
            <Text>Confirm Edit</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

Modify.propTypes = {
  navigation: PropTypes.object,
};

export default Modify;

