/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
import React from 'react';
import {
  ListItem as BaseListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
  H3, Icon, CardItem,
} from 'native-base';
import PropTypes from 'prop-types';
// import {mediaURL} from '../constants/urlConst';
import {deleteFile} from '../hooks/APIHook';
import {AsyncStorage, Alert} from 'react-native';

const ProfileListItem = (props) => {
  const {singleMedia} = props;
  return (
    <BaseListItem
      thumbnail
    >
      <Left>
        <Left style={{flex: 0.4}}>
          {props.singleMedia.media_type === 'audio' ? (
          <Thumbnail
            square
            source= {{uri: 'https://i.picsum.photos/id/1082/5416/3611.jpg'}}
          />
        ) : (
        <Thumbnail
          square
          source= {{uri: 'https://i.picsum.photos/id/1025/4951/3301.jpg'}}
        />
        )}
        </Left>
        <Body>
          <H3 numberOfLines={1}>{props.singleMedia.title}</H3>
          <Text numberOfLines={1}>{props.singleMedia.description}</Text>
        </Body>
        <Right style={{flex: 1}}>
          <CardItem>
            <Icon
              name='ios-trash'
              style={{color: 'red', fontSize: 25}}
              transparent
              onPress={() => {
                Alert.alert(
                    'Warning',
                    'Are you sure you want to delete this post?',
                    [
                      {
                        text: 'Ok',
                        onPress: async () => {
                          const response = await
                          deleteFile(singleMedia.file_id);
                          console.log('deleteclick', response);
                          if (response.message) {
                            props.getMedia();
                          }
                        },
                      },
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ],

                    {cancelable: true},
                );
              }}
            >
            </Icon>
            <Icon name='ios-construct' style={{color: 'green', fontSize: 25}}
              onPress={
                () => {
                  props.navigation.push('Modify', {file: props.singleMedia});
                }
              }>
            </Icon>
            <Icon name='ios-eye' style={{color: 'blue', fontSize: 25}}
              onPress={
                () => {
                  props.navigation.push('Single', {file: props.singleMedia});
                }
              }>

            </Icon>
          </CardItem>
        </Right>
      </Left>
    </BaseListItem>
  );
};

ProfileListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ProfileListItem;
