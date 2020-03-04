/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';
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
import {getUserList, getSearchedMedia} from '../hooks/APIHook';
import ListItem from '../components/ListItem';
import {MediaContext} from '../contexts/MediaContext';

const Search = (props) => {
  const {navigation} = props;
  // get seacrh word from home
  const searchKey = navigation.getParam('searchParam', 'no');

  const {searchMedia, setSearchMedia} = useContext(MediaContext);
  const [exist, setExist] = useState(true);
  const [loading, setLoading] = useState(true);

  const getList = async () =>{
    const nameList = await getUserList();
    // filter to return array of name from search bar
    const name = nameList.filter((item) => {
      return item.username.toLowerCase() == searchKey.toLowerCase();
    });
    console.log('search23', name);

    // if found, get media with the first user id
    if (name.length) {
      const data = await getSearchedMedia(name[0].user_id);
      setSearchMedia(data.reverse());
      setLoading(false);
    } else {
      console.log('search35');
      setExist(false);
    }
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
            dataArray={searchMedia}
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
              <H3>No search found.</H3>
            </Body>
          </CardItem>
        </Card>
      )}
    </Container>
  );
};

export default Search;
