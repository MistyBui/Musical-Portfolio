/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React, {useContext, useState, useEffect} from 'react';
import {getAllFav} from '../hooks/APIHook';
import {MediaContext} from '../contexts/MediaContext';
import {
  Container,
  List as BaseList,
  H3,
  View,
  Spinner,
  Card,
  CardItem,
  Body,
} from 'native-base';
import ListItem from '../components/ListItem';

const Favourites = (props) => {
  const {navigation} = props;
  const [loading, setLoading] = useState(true);
  const {favMedia, setFavMedia} = useContext(MediaContext);
  const [exist, setExist] = useState(true);


  const getList = async () => {
    const list = await getAllFav();
    if (list.length > 0) {
      setExist(true);
      setFavMedia(list.reverse());
      setLoading(false);
    } else {
      setExist(false);
      setLoading(false);
    }

    console.log('fav35', list);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Container>
      {exist ?
      (
    <View>
      {loading ? (
            <Spinner/>
            ) : (
          <BaseList
            dataArray={favMedia}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ListItem
              navigation={props.navigation}
              singleMedia={item}
              getMedia={getList}
            />}
          />)}
    </View>
    ) : (
      <Card transparent>
        <CardItem>
          <Body>
            <H3>No favourites.</H3>
          </Body>
        </CardItem>
      </Card>
    )}
    </Container>
  );
};

export default Favourites;
