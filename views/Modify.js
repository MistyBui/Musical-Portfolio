/* eslint-disable linebreak-style */
import React, {useState, useContext, useEffect} from 'react';
import {View, Text, Header, Container, Content, Form, Button, Body, Left, Right, ListItem, Radio} from 'native-base';
import {AsyncStorage} from 'react-native';
import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHooks';
import {MediaContext} from '../contexts/MediaContext';
import getAllMedia from '../hooks/APIHook';


const Modify = (props) => {
  const {media, setMedia} = useContext(MediaContext);

  const {inputs, handleTitleChange,
    handleDescChange, handleUpload} = useUploadForm();

  const modify = () => {
    handleUpload(props.navigation, setMedia);
  };
  return (
    <Container>
      <Content>
        <Text>Modify Title and Description here.</Text>
        <Form>
          <FormTextInput
            autoCapitalize='none'
            placeholder='title'
            value={inputs.title}
            onChangeText={handleTitleChange}
          />
          {inputs.titleError !== undefined && <Text>{inputs.titleError.title[0]}</Text>}
          <FormTextInput
            autoCapitalize='none'
            placeholder='description'
            value={inputs.description}
            onChangeText={handleDescChange}
          />
          <Button
            onPress={modify}
          >
            <Text>Edit</Text>
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
