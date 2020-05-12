import React from 'react'
import styles from './StyleSheet'
import { Text, View, RefreshControl, Alert } from 'react-native'
import Constants from 'expo-constants';
import {Pedometer} from 'expo-sensors'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { ScrollView } from 'react-native-gesture-handler';
import firebase from 'firebase';
import RecomendationEngine from './RecomendationEngine'
import {Notifications} from 'expo'


class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoadingWeather: true,
      weatherData: null,
      currentTemp: 0,
      location: null,
      errorMessage: null,
      isPedometerAvailable: "checking",
      pastStepCount: 0,
      pastWeek: 0,
      currentStepCount: 0,
      caloricInake: 0,
      currentWeight: 0,
      bmi: 0,
      day: 0,
      refreshing: false,
      isHealthy: true,
      cardColor: "green",
      bmiString: 'healthy',
      data: null,
      dataSetRestaurants: {},
      dataSetWorkouts: {},
      dataSetFood: {},
      name: null,
    }

    this.getWeather = this.getWeather.bind(this)
    this.updateGeneralUserLocation = this.updateGeneralUserLocation.bind(this)
    this.refresh = this.refresh.bind(this)
    this.updateGeneralUserStepCounts = this.updateUserStepCounts.bind(this)
    this.judgeBMI = this.judgeBMI.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
   
    // for reccomendations
    this.getData = this.getData.bind(this)
    this.createRestaurantDataSet = this.createRestaurantDataSet.bind(this)
    this.createWorkoutDataSet = this.createWorkoutDataSet.bind(this)
    this.createFoodDataSet = this.createFoodDataSet.bind(this)
    this.getFoodRecomendations = this.getFoodRecomendations.bind(this)
    this.getWorkoutRecomendations = this.getWorkoutRecomendations.bind(this)
    this.getRestaurantRecomendations = this.getRestaurantRecomendations.bind(this)

  }

  componentDidMount() {
      this.refresh()
    }

    getData() {
      firebase.database().ref('users').once('value', function (snapshot){
          this.setState({
            data: JSON.parse(JSON.stringify(snapshot)),
          })
      }.bind(this))
    }

    createRestaurantDataSet() {
      var x = this.state.data
      var SetRestaurants = this.state.dataSetRestaurants
      for(var y in x){
          SetRestaurants[x[y].first_name] = {}
          for (var z in x[y].ratings.restaurants) {
            SetRestaurants[x[y].first_name][z] =
              (x[y].ratings.restaurants)[z].rating
          }
        }

      this.setState({
        dataSetRestaurants: SetRestaurants,
        name: Object.keys(SetRestaurants)[0]
      })
   }
  
    createWorkoutDataSet() {
      var x = this.state.data
      var SetWorkouts = this.state.dataSetWorkouts
      for(var y in x){
          SetWorkouts[x[y].first_name] = {}
          for (var z in x[y].ratings.workouts) {
            SetWorkouts[x[y].first_name][z] =
              (x[y].ratings.workouts)[z].rating
          }
        }
      
      this.setState({
        dataSetWorkouts: SetWorkouts,
        name: Object.keys(SetWorkouts)[0]
      })
    }
  
    createFoodDataSet() {
        var x = this.state.data
        var SetFood = this.state.dataSetFood
        for(var y in x){
            SetFood[x[y].first_name] = {}
            for (var z in x[y].ratings.food) {
              SetFood[x[y].first_name][z] =
                (x[y].ratings.food)[z].rating
            }
          }
        
        this.setState({
          dataSetFood: SetFood,
          name: Object.keys(SetFood)[0]
        })
    }


    getRestaurantRecomendations() {
      this.getData()
      this.createRestaurantDataSet()
      //console.log(this.state.dataSetRestaurants)

      
      var engine = 
          new RecomendationEngine(this.state.dataSetRestaurants, this.state.name)
        
      console.log(engine)
      var x = engine.recommendation_eng()
      console.log(x)

      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/recomendations/restaurants/')
      .set( x[1] ).catch((error) => {
        console.log('error')
      })

      //return (this.recommendation_eng(this.dataSetRestaurants))
    }

    getWorkoutRecomendations() {
      this.getData()
      this.createWorkoutDataSet()

      var engine = 
          new RecomendationEngine(this.state.dataSetWorkouts, this.state.name)
     
      console.log(engine)
      var x = engine.recommendation_eng()
      console.log(x)

      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/recomendations/workouts/')
      .set( x[1] ).catch((error) => {
        console.log('error')
      })
      //console.log(this.state.dataSetWorkouts)
      //return (this.recommendation_eng(this.dataSetWorkouts))
    }

    getFoodRecomendations() {
      this.getData()
      this.createFoodDataSet()

      var engine = 
          new RecomendationEngine(this.state.dataSetFood, this.state.name)
      
      console.log(engine)
      var x = engine.recommendation_eng()
      console.log(x)

      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/recomendations/food/')
      .set( x[1] ).catch((error) => {
        console.log('error')
      })

      //console.log(this.state.dataSetFood)
      //return (this.recommendation_eng(this.dataSetFood))
    }

    refresh(){
      firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', function (snapshot){
        this.setState({ name: snapshot.val().first_name.toString() }) 
                      }.bind(this))
      

      /*this.getFoodRecomendations()
      this.getRestaurantRecomendations()
      this.getWorkoutRecomendations()*/

      this.refreshing = true

      this.getRestaurantRecomendations()
      this.getFoodRecomendations()
      this.getWorkoutRecomendations()
      this.getRestaurantRecomendations()
      this.getFoodRecomendations()
      this.getWorkoutRecomendations()
      this.getRestaurantRecomendations()
      this.getFoodRecomendations()
      this.getWorkoutRecomendations()

      
      
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/today/net_calories')
      .once('value', function (snapshot){
        this.setState({
          caloricInake: Math.round(snapshot.val().total_cal),
        })

      }.bind(this))

      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/personal_stats')
      .once('value', function (snapshot){
        this.setState({
          currentWeight: snapshot.val().weight,
          bmi: Number.parseFloat(snapshot.val().bmi).toPrecision(3),
          caloricGoal: snapshot.val().daily_calorie_goal
        })
        this.judgeBMI()
      }.bind(this), error => {
        console.error(error)
        })

      var currentDayInfo = null
      var moment = require('moment');
      var dayToUpdate = firebase.database().ref('users/' + firebase.auth().currentUser.uid + "/past_days/" + moment().format('ll'))
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/today').once('value', function (snapshot){
        dayToUpdate.set(snapshot.val())

      })

      this.updateUserStepCounts()


      this.refreshing = false
    }

    componentWillUnmount() {
      this._unsubscribe();
    }

    _subscribe = () => {
      this._subscription = Pedometer.watchStepCount(result => {
        this.setState({
          currentStepCount: result.steps
        });
      });
  
      Pedometer.isAvailableAsync().then(
        result => {
          this.setState({
            isPedometerAvailable: String(result)
          });
        },
        error => {
          this.setState({
            isPedometerAvailable: "Could not get isPedometerAvailable: " + error
          });
        }
      );
  
       var end = new Date();
       var start = new Date();
      start.setHours(0,0,0,0);

      Pedometer.getStepCountAsync(start, end).then(
        result => {
          this.setState({ pastStepCount: result.steps });
        },
        error => {
          this.setState({
            pastStepCount: "Could not get stepCount: " + error
          });
        }
      );

       end = new Date();
       start = new Date();
      var d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); 
      start.setDate(diff)
      Pedometer.getStepCountAsync(start, end).then(
        result => {
          this.setState({ pastWeek: result.steps });
          //console.log(this.pastWeek)
        },
        error => {
          this.setState({
            pastStepCount: "Could not get stepCount: " + error
          });
        }
      );
      

    };

    _unsubscribe = () => {
      this._subscription && this._subscription.remove();
      this._subscription = null;
    };

    getWeather() {
      return fetch('https://api.openweathermap.org/data/2.5/weather?lat='+ this.state.location.coords.latitude +
                '&lon=' + this.state.location.coords.longitude + '')


      .then ( (response) => response.json() )
      .then ( (responseJson) => {

        this.setState({
          isLoadingWeather: false,
          weatherData: responseJson,
          currentTemp: 0
        })
        this.setState({
          currentTemp: Math.round(((this.state.weatherData.main.temp-273.15)*1.8)+32)
        })
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/today/weather/')
          .set({ temp: Math.round(((this.state.weatherData.main.temp-273.15)*1.8)+32)
            }).catch((error) => {
        console.log('error')
      })

      })
      .catch((error) => {
        console.log('error')
      })
    }

    updateUserStepCounts(){
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/today/activity/steps')
      .set({ last_day: this.state.pastStepCount,
              last_week: this.state.pastWeek
       }).catch((error) => {
        console.log('error')
      })
    }

    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

    updateGeneralUserLocation(){

      var today = new Date()
      today = today.getDate()    

      this._subscribe();
      
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/location')
      .set({ longitude: this.state.location.coords.longitude,
              latitude: this.state.location.coords.latitude,
       }) .catch((error) => {
        console.log(error)
      })
      
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/today')
      .once('value', function (snapshot){
        if (today !=  snapshot.val().day){ 
          Alert.alert("You have not updated your weight today.\nPlease update in profile settings.")
          firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/today')
            .set({ day:  today,
                  hasUpdatedWeight: false,

            }) .catch((error) => {
              console.log(error)
            })
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/today/calories/')
            .set({ total_cal:  0,
            }) .catch((error) => {
              console.log(error)
            })
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/today/calories_burned').set({total_cal: 0})
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/today/net_calories').set({total_cal: 0})
          }
        
      }.bind(this))

    
   

    }

    componentWillMount() {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        this.setState({
          errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        });
      } else {
        this._getLocationAsync();
      }
    }

    _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location: location })
      this.getWeather()
      this.updateGeneralUserLocation()
    };

    judgeBMI(){
    
        if(this.state.bmi < 18.5){
          this.setState({
            isHealthy: false,
            bmiString: 'Underweight'
          })
        }
        else if(this.state.bmi> 18.5 && this.state.bmi < 25){
          this.setState({
            isHealthy: true,
            bmiString: 'Normal'
          })
        }
        else if(this.state.bmi > 25){
          this.setState({
            isHealthy: false,
            bmiString: 'Overweight'
          })
        }
    }

    render() {
      return (
        <View style={styles.dashBoard}>
          <Text style={styles.ProfileScreenName}>Dashboard</Text>
          <ScrollView scrollEnabled='true' style={{height: '100%', width: '100%', flexGrow: 1, marginTop: 30}}
           refreshControl={<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />}>
            <View style={styles.dashCard}><Text style={styles.dashText}>{this.state.isLoadingWeather ? 'Loading' : this.state.weatherData.name}</Text>
            <Text style={styles.dashContent}>{this.state.isLoadingWeather ? 'Loading' : this.state.currentTemp}&deg;F</Text></View>
            <View style={styles.dashCard}><Text style={styles.dashText}>BMI ({this.state.bmiString})</Text>
            <Text style={styles.dashContent}>{(this.state.bmi)}</Text></View>
            <View style={styles.dashCard}><Text style={styles.dashText}>Steps</Text>
            <Text style={styles.dashContent}>{(this.state.pastStepCount)}</Text></View>
            <View style={styles.dashCard}><Text style={styles.dashText}>Net Caloric Intake</Text>
            <Text style={styles.dashContent}>{this.state.refreshing ? 'Loading' : this.state.caloricInake} Cal</Text></View>
            <View style={styles.dashCard}><Text style={styles.dashText}>Target Caloric Intake</Text>
            <Text style={styles.dashContent}>{this.state.refreshing ? 'Loading' : this.state.caloricGoal} Cal</Text></View>
          </ScrollView>
  
        </View>
      );
    }
}

/*<View style={styles.dashCard}><Text style={styles.dashText}>Step Goal</Text>
            <Text style={styles.dashContent}>10,000</Text></View>
           
            <View style={styles.dashCard}><Text style={styles.dashText}>Net Caloric Intake</Text></View>
            <View style={styles.dashCard}><Text style={styles.dashText}>Net Caloric Intake Goal</Text></View>
            <View style={styles.dashCard}><Text style={styles.dashText}>Calories Burned</Text></View>
            <View style={styles.dashCard}><Text style={styles.dashText}>Calories Burned Goal</Text></View>
*/
export default HomeScreen

