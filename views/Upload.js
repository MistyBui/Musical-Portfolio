/* eslint-disable linebreak-style */
import React, {useState} from 'react';
import {View, Text, Header, Container, Content, Form, Button,Body, Left, Right, ListItem, Radio,} from 'native-base';
import {AsyncStorage, Image} from 'react-native';
import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHooks';
import  * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';



const Upload = (props) => {

    const [radio1, setRadio1] = useState(false);
    const [radio2, setRadio2] = useState(false);
    const [radio3, setRadio3] = useState(false);

    const [type, setType] = useState ({});

    const [file, setFile] = useState(null);


    const {inputs, handleTitleChange,
        handleDescChange} = useUploadForm();


    const AudioRadio = () => {
      if(radio1 == false){
        setRadio1(true);
        setRadio2(false);
        setRadio3(false);
        setType('audio/mp3');
      }else{
        setRadio1(false);
        setType(null);
      }
    }
    const VideoRadio = () => {
      if(radio2 == false){
        setRadio2(true);
        setRadio1(false);
        setRadio3(false);
        setType('video/mp4');
      }else{
        setRadio2(false);
        setType(null);
      }
    }
    const ImageRadio = () => {
      if(radio3 == false){
        setRadio3(true);
        setRadio2(false);
        setRadio1(false);
        setType('image');
      }else{
        setRadio3(false);
        setType(null);
      }
    }

       const componentDidMount = () => {
            getPermissionAsync();
            console.log('hi');
          }


        const getPermissionAsync = async () => {
            if(Constants.platform.ios){
                const status = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                console.log(status + 'status');
                if(status !== 'granted') {
                    alert('sorry blaablaa gibe permission');
                }
            }
        }

    /*    const pickImage = async () => {
            componentDidMount();

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        console.log(result);
        console.log(result.uri);
        setImage(result);
        }; */
        const pickFile = async () => {
          let result = await DocumentPicker.getDocumentAsync({
          });
          console.log(result);
          setFile(result);
        }

        const handleUpload = async () => {
            try {
            console.log('file', file);

            
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
            console.log(result);
            
            console.log('ohitus');
        } catch(e){
            console.log(e);
          };
          console.log(props);
          props.navigation.navigate('App');
        };


    return(

        <Container>
            <Content>
            <Text>upload</Text>

            <ListItem selected={radio1} onPress={AudioRadio}>
            <Left>
              <Text>Audio/mp3</Text>
            </Left>
            <Right>
              <Radio
                color={"#f0ad4e"}
                selectedColor={"#5cb85c"}
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
                color={"#f0ad4e"}
                selectedColor={"#5cb85c"}
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
                color={"#f0ad4e"}
                selectedColor={"#5cb85c"}
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
              <Text>Pick a file</Text>
            </Button>
          
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
            title="send img"
            onPress={handleUpload}
            />
            </Form>
            </Content>
        </Container>
    );

};
export default Upload;