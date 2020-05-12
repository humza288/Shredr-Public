import React from 'react';
import styles from './StyleSheet'
import firebase from 'firebase'
import {View, Text, FlatList, TouchableOpacity, Alert, Slider} from 'react-native';

class ActivityDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activity:{},
      caloriesBurned: 0,
      name: 0,
      estimatedDuration: 0,
      searchTitle: 0,
      rating: 0,
      totalCalBurned: 0,
      netCalories: 0,
      totalCal: 0
      
    }
    this.addActivityToToday = this.addActivityToToday.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    var activity = params.activity[0];
    var searchName = params.activity[1].charAt(0).toUpperCase() + params.activity[1].substring(1);

    
    this.setState({ searchTitle: searchName,
                    caloriesBurned: activity[0].nf_calories,
                    name: activity[0].name.charAt(0).toUpperCase() + activity[0].name.substring(1),
                    estimatedDuration: activity[0].duration_min})

    firebase.database().ref('users/' +  firebase.auth().currentUser.uid  
                + '/today/calories_burned/')
                .once('value', function (snapshot){
                  this.setState({
                    totalCalBurned: JSON.parse(JSON.stringify(snapshot)).total_cal
                  })
                }.bind(this))
    
    firebase.database().ref('users/' +  firebase.auth().currentUser.uid  
               + '/today/calories/')
              .once('value', function (snapshot){
      this.setState({
        totalCal: JSON.parse(JSON.stringify(snapshot)).total_cal
      })
    }.bind(this))
                     
  }

  incrementRating(value){
    this.setState({
      rating: value
    })
  }

  rateActivity(){
    if (this.state.rating <= 0)
      return

    Alert.alert("Workout Rated")
    firebase.database().ref('users/' + firebase.auth().currentUser.uid 
                                + '/ratings/workouts/' + this.state.name)
    .set({rating: this.state.rating})

  }


  addActivityToToday(){ 
    firebase.database().ref('users/' + firebase.auth().currentUser.uid  
                                    + '/today/workouts/' + this.state.name)
      .set({nf_calories: this.state.caloriesBurned,
            duration_min: this.state.estimatedDuration})
    
    
    var x = this.state.totalCalBurned + this.state.caloriesBurned
    console.log(x)

    firebase.database()
      .ref('users/' + firebase.auth().currentUser.uid + '/today/calories_burned/')
      .set({total_cal: x})
    
    var y = this.state.totalCal - x  
    firebase.database()
      .ref('users/' + firebase.auth().currentUser.uid + '/today/net_calories')
      .set({total_cal: y})
   

    Alert.alert("Activity Added!")
    this.rateActivity()
    this.props.navigation.navigate('ActivitySuggestions')
  }

  render() {
    return (
      <View>
      <View style={{height: '100%'}}>
        <Text style={{alignSelf:'center', fontSize:30, marginTop: 50,}}>Results For</Text>
        <Text style={{alignSelf:'center', fontSize: 20, marginBottom: 20}}>"{this.state.searchTitle}"</Text>
        <FlatList scrollEnabled={false}
          data={[
            {key: 'Name: ', value: this.state.name},
            {key: 'Estimated Duration: ', value: this.state.estimatedDuration + " Min"},
            {key: 'Estimated Calories Burned: ', value: this.state.caloriesBurned + " Cal"}
          ] } styles={{justifyContent: "center"}}
          renderItem={({item})=> <Text style={styles.item}>{item.key}{item.value}</Text>}
        />

        <Text style={[styles.inputLabel, {alignSelf:'center'}]}>Rating - {this.state.rating}</Text>
              <Slider
                minimumValue={0}
                maximumValue={5}
                minimumTrackTintColor="black"
                maximumTractTintColor="black"
                onValueChange={value => this.incrementRating(value)}
                step={0.25}
                style={{marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 30}}
                value={this.state.rating}
                thumbTintColor="red"
              />
        
        <TouchableOpacity onPress={this.addActivityToToday}
        style = {{width: "90%", marginLeft: '5%', marginBottom: 50}}>
                <View style = {{backgroundColor: '#292b2c', alignItems: 'center', 
                                justifyContent: 'center', borderRadius: 20}}>
                    <Text style = {{color: 'white', paddingVertical: 20}}>Add to Today</Text>
                </View>
            </TouchableOpacity>

      </View>
    </View>

    );
  }}

export default ActivityDetails