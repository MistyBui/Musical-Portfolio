/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
import React, {useState, useEffect} from 'react';
import {
  ListItem as BaseListItem,
  Left,
  Body,
  Right,
  Button,
  Text,
  Thumbnail,
  H3, Icon, Alert,
} from 'native-base';
import PropTypes from 'prop-types';
import {mediaURL} from '../constants/urlConst';
import {getUser, deleteFile} from '../hooks/APIHook';

const ProfileListItem = (props) => {
  const {navigation, singleMedia} = props;
  const [owner, setOwner] = useState({});
  const getOwner = async () => {
    const ownerName = await getUser(props.singleMedia.user_id);
    setOwner(ownerName);
  };

  useEffect(() => {
    getOwner();
  }, []);

  return (
    <BaseListItem
      thumbnail
    >
      <Left>
        <Thumbnail
          square
          source={{uri: mediaURL + props.singleMedia.filename}}
        />
      </Left>
      <Body>
        <H3 numberOfLines={1}>{props.singleMedia.title}</H3>
        <Text numberOfLines={1}>{props.singleMedia.description}</Text>
        <Text style={{color: 'gray', fontStyle: 'italic'}}>
          by {owner.username}
        </Text>
      </Body>
      <Right>
        <Button
          danger
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
          <Icon name='trash' />
        </Button>
        <Button
          transparent
          onPress={
            () => {
              props.navigation.push('Modify', {file: props.singleMedia});
            }
          }>
          <Icon name='md-construct'></Icon>
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
      </Right>
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
