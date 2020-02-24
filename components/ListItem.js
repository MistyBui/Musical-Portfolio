/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
import React, {useState, useEffect} from 'react';
import {
  ListItem as BaseListItem,
  Left,
  Body,
  Right,
  Button,
  Text,
  Thumbnail,
  H3,
} from 'native-base';
import PropTypes from 'prop-types';
import {mediaURL} from '../constants/urlConst';
import {getUser} from '../hooks/APIHook';

const ListItem = (props) => {
  const [owner, setOwner] = useState({});
  const getOwner = async () => {
    const owner = await getUser(props.singleMedia.user_id);
    setOwner(owner);
  };

  useEffect(() => {
    getOwner();
  }, []);

  return (
    <BaseListItem
      avatar>
      <Left>
        <Thumbnail
          square
          source={{uri: mediaURL + props.singleMedia.thumbnails.w160}}
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
        <Button onPress={
          () => {
            props.navigation.push('Single', {file: props.singleMedia});
          }
        }>
          <Text>View</Text>
        </Button>
      </Right>
    </BaseListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;


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
