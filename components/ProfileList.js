/* eslint-disable linebreak-style */
import React, {useContext, useEffect, useState} from 'react';
import {
  List as BaseList, Spinner, View,
} from 'native-base';
import ProfileListItem from '../components/ProfileListItem';
import {MediaContext} from '../contexts/MediaContext';
import {getUserMedia} from '../hooks/APIHook';
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';
import {NavigationEvents} from 'react-navigation';

const ProfileList = (props) => {
  const {userMedia, setUserMedia} = useContext(MediaContext);
  const [loading, setLoading] = useState(true);

  const getMedia = async () => {
    try {
      let data = [];
      const token = await AsyncStorage.getItem('userToken');
      data = await getUserMedia(token);

      console.log(data);
      setUserMedia(data.reverse());
      setLoading(false);
      console.log('medias', userMedia);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getMedia(props.mode);
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
                mode={props.mode}
                getMedia={getMedia}
              />}
            />
        )}
      <NavigationEvents
        onDidBlur={ () => {
          if (props.mode !=='all') {
            getMedia('all');
          }
        }}
      />
    </View>
  );
};

ProfileList.propTypes = {
  navigation: PropTypes.object,
  mode: PropTypes.string,
};

export default ProfileList;
