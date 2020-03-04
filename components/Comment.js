/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, {useState, useEffect, useContext} from 'react';
import {
  ListItem as BaseListItem,
  Right,
  Button,
  Text,
  Icon,
  Left, Body,
} from 'native-base';
import {AsyncStorage} from 'react-native';
import PropTypes from 'prop-types';
import {fetchDELETE} from '../hooks/APIHook';

const Comment = (props) =>{
  return (
    <BaseListItem thumbnail>
      <Left>
        <Left style={{flex: 0.2}}>
          <Text
            numberOfLines={1}
            style={{fontWeight: 'bold'}}>{props.singleMedia.username}</Text>
        </Left>
        <Body>
          <Text>{props.singleMedia.comment} </Text>
          <Text
            numberOfLines={1}
            style={{color: 'gray', fontStyle: 'italic'}}>
           ({props.singleMedia.time_added})
          </Text>
        </Body>
        <Right style={{flex: 0.2}}>
          <Button
            transparent
            onPress={ async () => {
              const token = await AsyncStorage.getItem('userToken');
              console.log('comment30', token);
              const del = await fetchDELETE('comments',
                  props.singleMedia.comment_id, token);
              console.log('comment33', del);
              if (del.message) {
                props.getMedia();
              }
            }}
          >
            <Icon name='trash' style={{color: 'red'}}></Icon>
          </Button>
        </Right>
      </Left>
    </BaseListItem>
  );
};

Comment.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  getMedia: PropTypes.func,
};

export default Comment;
