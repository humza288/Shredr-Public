import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import Icon from 'react-native-vector-icons/Ionicons'
import UpdateModel from './UpdateModel'
import ProfileScreen from './ProfileScreen'
import HistoryScreen from './HistoryScreen'
import PastDayScreen from './PastDayScreen'


const UpdateModelStackNavigator = createStackNavigator({
      Update: {screen: UpdateModel},
      History: {screen: HistoryScreen},
      ProfileScreen: {screen: ProfileScreen},
      PastDayScreen: {screen: PastDayScreen},
  },
  {
      headerMode: 'none',
      navigationOptions: {
          headerVisible: false,
      },
      initialRouteName: 'ProfileScreen'
  })

  export default UpdateModelStackNavigator