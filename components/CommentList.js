/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, {useContext, useState, useEffect} from 'react';
import Comment from './Comment';
import {MediaContext} from '../contexts/MediaContext';
import {
  List as BaseList, Spinner, View,
} from 'native-base';
import {getFileComment, fetchGET} from '../hooks/APIHook';
import {AsyncStorage} from 'react-native';

const CommentList = (props) => {
  const {commentMedia, setCommentMedia} = useContext(MediaContext);
  const [loading, setLoading] = useState(true);

  const getComments = async () => {
    try {
      const list = await getFileComment(props.file);
      console.log('commentlist', list);
      const token = await AsyncStorage.getItem('userToken');
      // get users whose id appears in list
      const userList = await Promise.all(list.map((item) => {
        return fetchGET('users', item.user_id, token);
      }));
      console.log('cmtlist', userList);
      // join 2 array to have list with user and file information
      const newList = mergeArrayObjects(list, userList);
      console.log('cmtList27', newList);
      setCommentMedia(newList.reverse());
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  // merging two objects
  const mergeArrayObjects = (arr1, arr2) =>{
    return arr1.map((item, i)=>{
      if (item.user_id === arr2[i].user_id) {
        return Object.assign({}, item, arr2[i]);
      }
    });
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <View>
      {loading ? (
      <Spinner/>
     ) : (
      <BaseList
        dataArray={commentMedia}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <Comment
          navigation={props.navigation}
          singleMedia={item}
          getMedia={getComments}
          user = {props.owner}
        />}
      />
     )}
    </View>
  );
};

export default CommentList;
