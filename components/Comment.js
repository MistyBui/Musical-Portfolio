/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import {
  ListItem as BaseListItem,
  Right,
  Button,
  Text,
  Icon,
  Left,
} from 'native-base';
import {AsyncStorage} from 'react-native';
import PropTypes from 'prop-types';
import {fetchDELETE} from '../hooks/APIHook';
import {getUser} from '../hooks/APIHook';

const Comment = (props) =>{
  const [owner, setOwner] = useState({});

  const getOwner = async () => {
    const ownerName = await getUser(props.singleMedia.user_id);
    setOwner(ownerName);
  };
  useEffect(() => {
    getOwner();
  }, []);

  return (
    <BaseListItem thumbnail>
      <Left>
        <Text>{owner.username}: </Text>
        <Text>{props.singleMedia.comment} </Text>
        <Text
          numberOfLines={1}
          style={{color: 'gray', fontStyle: 'italic'}}>
           ({props.singleMedia.time_added})
        </Text>
      </Left>
      <Right>
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
          <Icon name='trash' color='#FF6347'></Icon>
        </Button>
      </Right>
    </BaseListItem>
  );
};

Comment.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  getMedia: PropTypes.func,
};

export default Comment;
