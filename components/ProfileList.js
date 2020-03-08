/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import React, {useContext, useEffect, useState} from 'react';
import {
  List as BaseList, Spinner, View,
} from 'native-base';
import ProfileListItem from '../components/ProfileListItem';
import {MediaContext} from '../contexts/MediaContext';
import {getUserMedia, getCurrentUser, fetchGET} from '../hooks/APIHook';
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';
import {NavigationEvents} from 'react-navigation';

const ProfileList = (props) => {
  const {userMedia, setUserMedia} = useContext(MediaContext);
  const [loading, setLoading] = useState(true);

  const getMedia = async () => {
    try {
      /* let data = [];
      const token = await AsyncStorage.getItem('userToken');
      data = await getUserMedia(token);*/
      const list = await fetchGET('tags/musicalportfolio');
      console.log('profile23', list);

      const user = await getCurrentUser();
      console.log('user', user.user_id);

      const data = list.filter((item) => {
        console.log('indata', item.user_id);
        return item.user_id == user.user_id;
      });


      console.log(data);
      setUserMedia(data.reverse());
      setLoading(false);
      console.log('medias', userMedia);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  return (
    <View>
      {loading ? (
          <Spinner/>
        ) : (
            <BaseList
              dataArray={userMedia}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => <ProfileListItem
                navigation={props.navigation}
                singleMedia={item}
                getMedia={getMedia}
              />}
            />
        )}
    </View>
  );
};

ProfileList.propTypes = {
  navigation: PropTypes.object,
  mode: PropTypes.string,
};

export default ProfileList;
