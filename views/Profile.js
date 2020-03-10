/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState, useContext} from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Button,
  Icon,
  View,
} from 'native-base';
import {AsyncStorage} from 'react-native';
import PropTypes from 'prop-types';
import {fetchGET, getCurrentUser} from '../hooks/APIHook';
import AsyncImage from '../components/AsyncImage';
import ProfileList from '../components/ProfileList';
import {Dimensions} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {getUserMedia, getFavourites} from '../hooks/APIHook';
import {NavigationEvents} from 'react-navigation';
import {MediaContext} from '../contexts/MediaContext';

const deviceHeight = Dimensions.get('window').height;


const Profile = (props) => {
  const {navigation} = props;
  const {favMedia, setFavMedia} = useContext(MediaContext);
  const [posts, setPosts] = useState({});
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
      const reversePic = avatarPic.reverse();
      let avPic = '';
      if (avatarPic.length === 0) { // if avatar is not set
        avPic = 'https://placekitten.com/1024/1024';
      } else {
        avPic = mediaURL + reversePic[0].filename;
      }
      console.log('profile pic', avPic);
      const token = await AsyncStorage.getItem('userToken');
      const data= await getUserMedia(token);
      const favList = await getFavourites();
      setFavMedia(favList);
      console.log('favelengh', favList.length);
      setPosts(data);
      setUser((user) => (
        {
          userdata: userData,
          avatar: avPic,
          count: data.length,
          like: favMedia.length,
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
    <Container style={{flex: 1}}>
      <Content /* contentContainerStyle={{flex: 1, justifyContent: 'center'}}
        style={{padding: 20}}*/>
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
          <CardItem>
            <Icon name='heart'/>
            <Text numberOfLines={1}>
              {user.like} likes
            </Text>
          </CardItem>
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
                <Text>Edit Profile</Text>
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
        <View>
          <ProfileList navigation = {navigation} mode={'all'}></ProfileList>
        </View>
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
