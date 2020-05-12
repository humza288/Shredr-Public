import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import ActivityScreen from './ActivityScreen'
import ActivitySuggestionScreen from './ActivitySuggestionScreen'
import ActivityDetails from './ActivityDetails'


const ActivityStackNavigator = createStackNavigator({
      Stats: {screen: ActivityScreen},
      ActivitySuggestions: {screen: ActivitySuggestionScreen},
      ActivityDetails: {screen: ActivityDetails}
  },
  {
      headerMode: 'none',
      navigationOptions: {
          headerVisible: false,
      },
      initialRouteName: 'ActivitySuggestions'
  })

  export default ActivityStackNavigator