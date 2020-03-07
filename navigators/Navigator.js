/* eslint-disable linebreak-style */
/* eslint-disable react/display-name */
/* eslint-disable indent */
import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
// import MyFiles from '../views/MyFiles';
import Upload from '../views/Upload';
// import Modify from '../views/Modify';
import AuthLoading from '../views/AuthLoading';
import Login from '../views/Login';
import Search from '../views/Search';
import Modify from '../views/Modify';
import ModifyUser from '../views/ModifyUser';
import Favourites from '../views/Favourites';
import {Icon} from 'native-base';


const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Profile,
    Upload,
    Favourites,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: () => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home';
        } else if (routeName === 'Profile') {
          iconName = 'person';
        } else if (routeName === 'Upload') {
          iconName = 'md-arrow-round-up';
        } else if (routeName === 'Favourites') {
          iconName = 'heart';
        }
        // You can return any component that you like here!
        return <Icon
          name={iconName}
          size={25}
        />;
      },
    }),
      tabBarOptions: {
        activeTintColor: '#000',
    },
  },
);

const StackNavigator = createStackNavigator(
  // RouteConfigs
  {
    Home: {
      screen: TabNavigator,
      navigationOptions: {
        headerMode: 'none', // this will hide the header
      },
    },
    Single: {
      screen: Single,
    },
    Modify: {
      screen: Modify,
    },
    Search: {
      screen: Search,
    },
    Logout: {
      screen: Login,
    },
    ModifyUser: {
      screen: ModifyUser,
    },
  },
);

const Navigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: StackNavigator,
    Auth: Login,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default createAppContainer(Navigator);
