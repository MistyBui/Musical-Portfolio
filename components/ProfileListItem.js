/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
import React from 'react';
import {
  ListItem as BaseListItem,
  Left,
  Body,
  Right,
  Button,
  Text,
  Thumbnail,
  H3, Icon, Alert, CardItem,
} from 'native-base';
import PropTypes from 'prop-types';
import {mediaURL} from '../constants/urlConst';
import {deleteFile} from '../hooks/APIHook';

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
        <Right style={{flex: 0.4}}>
          <CardItem>
            <Button
              transparent
              onPress={() => {
                Alert.alert(
                    'Warning',
                    'Are you sure you want to delete this post?',
                    [
                      {
                        text: 'Ok',
                        onPress: () => {
                          deleteFile(singleMedia.file_id),
                          props.navigation.navigate('Loading'),
                          setTimeout(() => {
                            props.navigation.push('MyFiles');
                          }, 500);
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
              <Icon name='trash' style={{color: 'red'}} />
            </Button>
            <Button
              transparent
              onPress={
                () => {
                  props.navigation.push('Modify', {file: props.singleMedia});
                }
              }>
              <Icon name='md-construct' style={{color: 'green'}}></Icon>
            </Button>
            <Button
              transparent
              onPress={
                () => {
                  props.navigation.push('Single', {file: props.singleMedia});
                }
              }>
              <Icon name='eye'></Icon>
            </Button>
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


/* <BaseListItem thumbnail>
      <Left>
        <Thumbnail
          square
          source={{uri: mediaURL + props.singleMedia.thumbnails.w160}}
        />
      </Left>
      <Body>
        <H3 numberOfLines={1}>{props.singleMedia.title}</H3>
        <Text numberOfLines={1}>{props.singleMedia.description}</Text>
      </Body>
      <Right>
        <Button onPress={
          () => {
            props.navigation.push('Single', {file: props.singleMedia});
          }
        }>
          <Text>View</Text>
        </Button>
      </Right>
    </BaseListItem> */
