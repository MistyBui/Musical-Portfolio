import React from 'react';
import List from '../components/List';
import {View} from 'react-native';

const Home = (props) => {
  // eslint-disable-next-line react/prop-types
  const {navigation} = props;
  return (
    <View>
      <List navigation ={navigation} mode={'all'}></List>
    </View>
  );
};


export default Home;
