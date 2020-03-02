/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext} from 'react';
import {
  Container,
  List as BaseList,
  Text, H3,
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
  const searchKey = navigation.getParam('searchParam', 'no');
  // console.log('search', searchKey);
  // const [user, setUser] = useState({});
  const {searchMedia, setSearchMedia} = useContext(MediaContext);
  const [exist, setExist] = useState(true);
  const [loading, setLoading] = useState(true);

  const getList = async () =>{
    const nameList = await getUserList();
    // console.log('search 21:', nameList);
    // console.log('search22', searchKey);
    const name = nameList.filter((item) => {
      return item.username.toLowerCase() == searchKey.toLowerCase();
    });
    console.log('search23', name);

    if (name.length) {
      // setUser(name);
      // console.log('search30', user);
      const data = await getSearchedMedia(name[0].user_id);
      // console.log('search33:', data);
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
