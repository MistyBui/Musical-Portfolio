import React, {useEffect, useState} from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Button,
  Icon,
} from 'native-base';
import {AsyncStorage} from 'react-native';
import PropTypes from 'prop-types';
import {fetchGET, getCurrentUser} from '../hooks/APIHook';
import AsyncImage from '../components/AsyncImage';
import {Dimensions} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {getUserMedia} from '../hooks/APIHook';
import {NavigationEvents} from 'react-navigation';

const deviceHeight = Dimensions.get('window').height;


const Profile = (props) => {
  const [user, setUser] = useState({
    userdata: {},
    avatar: 'https://',
    count: 0,
    like: 0,
  });
  const userToState = async () => {
    try {
      const userData = await getCurrentUser();
      const avatarPic = await fetchGET('tags', 'avatar_' + userData.user_id);
      let avPic = '';
      if (avatarPic.length === 0) { // if avatar is not set
        avPic = 'https://placekitten.com/1024/1024';
      } else {
        avPic = mediaURL + avatarPic[0].filename;
      }
      const token = await AsyncStorage.getItem('userToken');
      const data= await getUserMedia(token);
      setUser((user) => (
        {
          userdata: userData,
          avatar: avPic,
          count: data.length,
        }));
    } catch (e) {
      console.log('Profile error: ', e.message);
    }
  };

  useEffect(() => {
    userToState();
  }, []);

  const signOutAsync = async () => {
    await AsyncStorage.clear();
    props.navigation.navigate('Auth');
  };

  console.log('ava', user.avatar);
  return (
    <Container>
      <Content contentContainerStyle={{flex: 1, justifyContent: 'center'}}
        style={{padding: 20}}>
        <Card>
          <CardItem header border>
            <Body>
              <AsyncImage
                style={{
                  width: '100%',
                  height: deviceHeight / 3,
                  borderRadius: 10,
                }}
                spinnerColor='#777'
                source={{uri: user.avatar}}
              />
            </Body>
          </CardItem>
          <CardItem>
            <Icon name='person'/>
            <Text numberOfLines={1}>
              {user.userdata.username}
              ({user.userdata.email})
            </Text>
          </CardItem>
          <CardItem>
            <Icon name='folder-open'/>
            <Text numberOfLines={1}>
              {user.count} posts
            </Text>
          </CardItem>
          {/* <CardItem>
            <Icon name='heart'/>
            <Text numberOfLines={1}>
              {user.count} likes
            </Text>
          </CardItem>*/}
          <CardItem footer bordered>
            <Body style={{flexDirection: 'row',
              alignSelf: 'center', marginTop: 5}}>
              <Button rounded info
                style={{padding: 10, alignSelf: 'center'}}
                onPress={
                  () => {
                    props.navigation.push('ModifyUser', {func: userToState});
                  }
                }>
                <Text>Modify</Text>
              </Button>
              <Button
                rounded success
                style={{padding: 10, alignSelf: 'center'}}
                onPress={signOutAsync}>
                <Text>Logout</Text>
              </Button>
            </Body>
          </CardItem>
        </Card>
      </Content>
      <NavigationEvents
        onDidBlur={ () => {
          userToState();
        }
        }
      />
    </Container>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
