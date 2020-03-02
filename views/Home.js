/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import List from '../components/List';
import {
  Container,
  View,
  Header,
  Item,
  Button,
  // Text,
  Icon,
  Input} from 'native-base';
import {NavigationEvents} from 'react-navigation';


const Home = (props) => {
  // eslint-disable-next-line react/prop-types
  const {navigation} = props;
  const [search, setSearch] = useState('');

  const clearSearch = () => {
    setSearch('');
  };

  return (
    <Container>
      <Header
        searchBar
        rounded
      >
        <Item>
          <Button
            transparent
            onPress={() => {
              if (search.length >0) {
                props.navigation.push('Search', {
                  searchParam: search,
                });
              } else {
                alert('Empty search input!!!');
              }
            }}>
            <Icon name="ios-search" />
          </Button>
          <Input
            autoCapitalize='none'
            placeholder="Search author here..."
            value={search.toString()}
            onChangeText={(text) => setSearch(text)}
          />
          <Button
            transparent
            onPress={() => clearSearch()}>
            <Icon name='trash'/>
          </Button>
        </Item>
      </Header>
      <View>
        <List navigation ={navigation} mode={'all'}></List>
      </View>
      <NavigationEvents
        onDidBlur={ () => {
          setSearch('');
        }
        }
      />
    </Container>
  );
};


export default Home;
