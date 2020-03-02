/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, {useContext, useState, useEffect} from 'react';
import Comment from './Comment';
import {MediaContext} from '../contexts/MediaContext';
import {
  List as BaseList, Spinner, View,
} from 'native-base';
import {getFileComment} from '../hooks/APIHook';
// import {AsyncStorage} from 'react-native';

const CommentList = (props) => {
  const {commentMedia, setCommentMedia} = useContext(MediaContext);
  const [loading, setLoading] = useState(true);

  const getComments = async () => {
    try {
      const list = await getFileComment(props.file);
      console.log('commentlist', list);
      setCommentMedia(list.reverse());
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
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
          user = {props.user}
        />}
      />
     )}
    </View>
  );
};

export default CommentList;
