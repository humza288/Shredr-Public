import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { createBottomTabNavigator} from 'react-navigation-tabs'
import HomeScreen from './HomeScreen'
import FoodScreen from './FoodScreen'
import ActivityScreen from './ActivityScreen'
import ProfileScreen from './ProfileScreen'
import SettingsScreen from './UpdateModel'
import FoodStackNavigator from './FoodStack'
import UpdateModelStackNavigator from './UpdateModelStack'
import ActivityStack from './ActivityStack'
import ActivityStackNavigator from './ActivityStack'

const TabNavigator = createBottomTabNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-home" color={tintColor} size={24} />
        )
      },
      
    },
    Food: {
      screen: FoodStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Diet',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-pizza" color={tintColor} size={24} />
        )
      }
    },
    
    Activity: {
      screen: ActivityStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Activity',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-walk" color={tintColor} size={24} />
        )
      }
    },
    
    Profile: {
      screen: UpdateModelStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-person" color={tintColor} size={24} />
        )
      }
    },
  },
  {
    initialRouteName: 'Home',
    order:['Home', 'Food', 'Activity', 'Profile'],
    swipeEnabled: true,
  
    navigationOptions:({ navigation }) => {
      const { routeName } = navigation.state.routes
      [navigation.state.index];
      return {
        tabBarVisible: 'true',
        headerTitle: routeName
      }
    },
    
    tabBarOptions: {
      inactiveTintColor: 'grey',
      activeTintColor: 'red',
      style: {
        backgroundColor: 'black'
      }
    }
  
  }
  );

  export default TabNavigator