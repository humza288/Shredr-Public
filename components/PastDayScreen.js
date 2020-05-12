import React from 'react';
import styles from './StyleSheet'
import firebase from 'firebase'
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';

class PastDayScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      day:{},
    }

  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const x = params;
    console.log(x.day[0])
    this.setState({
      day: x.day[0],
      date: x.day[1],
      total_cal: x.day[0].calories.total_cal,
      net_cal: x.day[0].net_calories.total_cal,
      burned_cal: x.day[0].calories_burned.total_cal,
      steps: x.day[0].activity.steps.last_day,
    })

  

  }

  render() {
    return (
      <View>
      <View style={{height: '100%'}}>
        <Text style={{alignSelf:'center', fontSize:30, marginTop: 50,}}>{this.state.date}</Text>
        <Text style={{alignSelf:'center', fontSize: 20, marginBottom: 20}}></Text>
        
        <FlatList scrollEnabled={true}
          data={[
            {key: 'Caloric Intake: ', value: this.state.total_cal + " Cal"},
            {key: 'Caloric Burned: ', value: this.state.burned_cal + " Cal"},
            {key: 'Net Caloric Intake: ', value: this.state.net_cal + " Cal"},
            {key: 'Steps: ', value: this.state.total_cal},
            {key: 'Step Goal: ', value: "10,000"},
          ] } styles={{justifyContent: "center"}}
          renderItem={({item})=> <Text style={styles.item}>{item.key}{item.value}</Text>}
        />
        
        <TouchableOpacity onPress={() => this.props.navigation.navigate('History')}
        style = {{width: "90%", marginLeft: '5%', marginBottom: 20, marginTop: 20}}>
                <View style = {{backgroundColor: '#d9534f', alignItems: 'center', 
                                justifyContent: 'center', borderRadius: 20}}>
                    <Text style = {{color: 'white', paddingVertical: 20}}>Back</Text>
                </View>
            </TouchableOpacity>

      </View>
    </View>

    );
  }}

export default PastDayScreen