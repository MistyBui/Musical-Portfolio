import React, {useState, useEffect, useContext} from 'react';
import ListItem from '../components/ListItem';
import {AsyncStorage} from 'react-native';
import {getUserMedia} from '../hooks/APIHook';
import {MediaContext} from '../contexts/MediaContext';
import {
    List as BaseList, Spinner, View,
  } from 'native-base';
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

  useEffect(
      () => {
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
              renderItem={({item}) => <ListItem
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


export default ProfileList;