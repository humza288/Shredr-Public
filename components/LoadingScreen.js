import React from 'react'
import styles from './StyleSheet'
import { View, ActivityIndicator } from 'react-native'
import firebase from 'firebase'

class LoadingScreen extends React.Component {

    componentDidMount() {
        this.checkIfLoggedIn();
      }
    
      checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.props.navigation.navigate("Home")
          }
          else {
            this.props.navigation.navigate("Welcome")
          }
        })
      }
      
        static navigationOptions = {
          title: 'Home',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        };

    render() {
      return (
        <View style={styles.main}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
}

export default LoadingScreen