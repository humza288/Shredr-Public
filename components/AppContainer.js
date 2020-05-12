import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import AppSwitchNavigator from './AppSwitchNavigator'

const AppContainer = createAppContainer(AppSwitchNavigator)

export default AppContainer