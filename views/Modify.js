/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {Text, Container, Content, Form, Button} from 'native-base';
import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHook';
import {MediaContext} from '../contexts/MediaContext';


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
          {inputs.titleError !== undefined &&
            <Text>{inputs.titleError.title[0]}</Text>}
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
