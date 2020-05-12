import React from 'react'
import styles from './StyleSheet'
import firebase from 'firebase'
import { Text, View,  TouchableOpacity, Alert, Slider } from 'react-native'

class RestaurantRating extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        rating: 0,
        query: '',
        ratings: null
    }
    this.updateUserRating = this.updateUserRating.bind(this)
}

updateUserRating(){
    if (this.state.rating <= 0)
        return 

        firebase.database().ref('users/' + firebase.auth().currentUser.uid 
                                + '/ratings/restaurants/' + this.state.query)
    .set({rating: this.state.rating})
    
    Alert.alert("Restaurant Rated")
  }
  
  componentDidMount() {
    const { params } = this.props.navigation.state;
    const restaurant = params;
    this.setState({
        query: restaurant.Restaurant
    })
  }

    render() {

      return (
        <View>
          <Text style={{alignSelf:'center', fontSize:40, marginTop: 50,}}>Rate this restaurant?</Text>
          <Text style={[styles.email, {alignSelf:'center'}]}>
              (This will help with reccomendations)</Text>
        <Text style={[styles.email, {alignSelf:'center', marginBottom: "35%"}]}>
                    {this.state.query}</Text>

          <Text style={[styles.inputLabel, {alignSelf:'center'}]}>Rating - {this.state.rating}</Text>
              <Slider
                minimumValue={0}
                maximumValue={5}
                minimumTrackTintColor="black"
                maximumTractTintColor="black"
                onValueChange={value => this.setState({ rating: value })}
                step={0.25}
                style={{marginLeft: 20, marginRight: 20, marginBottom: "35%"}}
                value={this.state.rating}
                thumbTintColor="red"
              />

          <TouchableOpacity onPress={this.updateUserRating}
        style = {{width: "90%", marginLeft: '5%', marginBottom: 20}}>
                <View style = {{backgroundColor: '#0275d8', alignItems: 'center', 
                                justifyContent: 'center', borderRadius: 20}}>
                    <Text style = {{color: 'white', paddingVertical: 20}}>Rate</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('Food')}
        style = {{width: "90%", marginLeft: '5%', marginBottom: 10}}>
                <View style = {{backgroundColor: '#d9534f', alignItems: 'center', 
                                justifyContent: 'center', borderRadius: 20}}>
                    <Text style = {{color: 'white', paddingVertical: 20}}>Continue</Text>
                </View>
            </TouchableOpacity>
      </View>
      );
    }
}

export default RestaurantRating