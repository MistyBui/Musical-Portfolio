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
  H3, Icon,
} from 'native-base';
import PropTypes from 'prop-types';
// import {mediaURL} from '../constants/urlConst';
import {getUser} from '../hooks/APIHook';

const ListItem = (props) => {
  const [owner, setOwner] = useState({});
  const getOwner = async () => {
    const ownerName = await getUser(props.singleMedia.user_id);
    console.log('list item', props.singleMedia );
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
        {props.singleMedia.media_type === 'audio' ? (
          <Thumbnail
            square
            source= {{uri: 'https://i.picsum.photos/id/145/4288/2848.jpg'}}
          />
        ) : (
        <Thumbnail
          square
          source= {{uri: 'https://i.picsum.photos/id/1082/5416/3611.jpg'}}
        />
        )}
      </Left>
      <Body>
        <H3 numberOfLines={1}>{props.singleMedia.title}</H3>
        {props.singleMedia.description != 'undefined' ?
        (<Text numberOfLines={1}>{props.singleMedia.description}</Text>) :
        (<Text></Text>)}

        <Text style={{fontStyle: 'italic'}}>
          <Text style={{color: 'gray'}}>{props.singleMedia.media_type} </Text>
          <Text style={{color: 'gray'}}>by {owner.username}</Text>
        </Text>
      </Body>
      <Right>
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

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
