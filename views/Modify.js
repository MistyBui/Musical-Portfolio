/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import React, {useContext} from 'react';
import {Text, Container,
  CardItem, Content, Form, Button} from 'native-base';
import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHook';
import {MediaContext} from '../contexts/MediaContext';
import {fetchPUT, getMediaByTag,
  fetchGET, getCurrentUser} from '../hooks/APIHook';
import {AsyncStorage} from 'react-native';

const Modify = (props) => {
  const {navigation} = props;
  const {media, setMedia} = useContext(MediaContext);
  const {userMedia, setUserMedia} = useContext(MediaContext);
  const file = navigation.state.params.file;
  console.log('modify15', file);
  const {inputs, handleTitleChange,
    handleDescChange} = useUploadForm();

  const save = async (input) => {
    const token = await AsyncStorage.getItem('userToken');
    const update = await fetchPUT('media/' + file.file_id,
        input, token);
    console.log('modify25', update);
    if (update.message == 'File info updated') {
      const data = await getMediaByTag();
      console.log(data);
      setMedia(data.reverse());
      const list = await fetchGET('tags/musicalportfolio');
      const user = await getCurrentUser();
      const userList = list.filter((item) => {
        console.log('indata', item.user_id);
        return item.user_id == user.user_id;
      });
      setUserMedia(userList.reverse());
      props.navigation.navigate('Home');
    } else {
      alert('Update fail. Contact admin.');
    }
    return update;
  };
  return (
    <Container >
      <Content contentContainerStyle={{flex: 1, justifyContent: 'center'}}
        style={{padding: 20}}>
        <Text style={{fontSize: 20, alignSelf: 'center'}}>
            Modify form</Text>
        <Form>
          <CardItem>
            <FormTextInput
              autoCapitalize='none'
              placeholder='Enter new title'
              value={inputs.title}
              onChangeText={handleTitleChange}
            />
            {inputs.titleError !== undefined &&
            <Text>{inputs.titleError.title[0]}</Text>}
            <Button rounded light
              style={{padding: 10, alignSelf: 'center'}}
              onPress={() => {
                if (Object.keys(inputs).length == 0) {
                  alert('New title is blank.');
                } else {
                  const data = {'title': inputs.title};
                  save(data);
                }
              }}>
              <Text>Save</Text>
            </Button>
          </CardItem>
          <CardItem>
            <FormTextInput
              autoCapitalize='none'
              placeholder='Enter new description'
              value={inputs.description}
              onChangeText={handleDescChange}
            />
            <Button rounded light
              style={{padding: 10, alignSelf: 'center'}}
              onPress={() => {
                if (Object.keys(inputs).length == 0) {
                  alert('New description is blank.');
                } else {
                  const data = {'description': inputs.description};
                  save(data);
                }
              }}>
              <Text>Save</Text>
            </Button>
          </CardItem>
        </Form>
      </Content>
    </Container>
  );
};

Modify.propTypes = {
  navigation: PropTypes.object,
};

export default Modify;
