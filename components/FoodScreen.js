import React from 'react';
import { Text, View, ActivityIndicator, TextInput, TouchableWithoutFeedback, Button, TouchableWithoutFeedbackBase, Alert } from 'react-native'
import styles from './StyleSheet'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { FlatList, TouchableOpacity, RefreshControl } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import firebase from 'firebase'


class FoodScreen extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        dataSource: null,
        dataSourceFiltered: null,
        nearbyRestaurants: null,
        isFocused: false,
        hasSearched: false,
        longitude: null,
        latitude: null,
        query: '',
        uId: null,
        longitude: null,
        latitude: null,
        Restaurant: null,
        similarUser: false,
        recomendations: {},
        unfilter: false,
        currentCal: null,
        maxCal: null,
        useNatural: false,
      }
      
      this.queryAPI = this.queryAPI.bind(this)
      this.useNearbySuggestion = this.useNearbySuggestion.bind(this)
      this.getNearby = this.getNearby.bind(this)  
      this.handleSimilarUser = this.handleSimilarUser.bind(this)
      this.filterResults = this.filterResults.bind(this)
      this.postData = this.postData.bind(this)
    }
  
    handleFocus = () => this.setState({isFocused: true})
    handleBlur = () => this.setState({isFocused: false})
    handleLoading = () => this.setState({isLoading: true})
    handleNotLoading = () => this.setState({isLoading: false})
  
    componentDidMount() {

          firebase.database().ref('users/' + firebase.auth().currentUser.uid.toString() + '/recomendations/restaurants/')
            .once('value', function (snapshot){
            this.setState({ recomendations: snapshot })
                          }.bind(this), () => {
                            console.log(this.state.recomendations);
                        });
          
        
          firebase.database().ref('users/' + firebase.auth().currentUser.uid.toString() + '/today/net_calories')
            .once('value', function (snapshot){
            this.setState({ currentCal: snapshot.val().total_cal})
                          }.bind(this))

          firebase.database().ref('users/' + firebase.auth().currentUser.uid.toString() + '/location')
            .once('value', function (snapshot){
            this.setState({ longitude: snapshot.val().latitude,
                          latitude: snapshot.val().longitude})
                          this.getNearby()
                        }.bind(this))


          firebase.database().ref('users/' + firebase.auth().currentUser.uid.toString() + '/personal_stats')
          .once('value', function (snapshot){
          this.setState({ maxCal: snapshot.val().daily_calorie_goal})
                        }.bind(this))
          }

          

     

        getNearby() {      
          return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch' + 
          '/json?location=' + this.state.longitude + ',' + this.state.latitude +
          '&radius=1500&type=restaurant)
              .then ( (response) => response.json() )
              .then ( (responseJson) => {
    
              this.setState({
                nearbyRestaurants: responseJson.results
              })
                //console.log(this.state.nearbyRestaurants)
              })
    
              .catch((error) => {
                console.log(error)
              })
            }
    
    useNearbySuggestion(x) {
      this.setState({
        Restaurant: x
      })
      this.props.navigation.navigate('RestaurantRating', {Restaurant: x})
      this.state.query = x
      this.queryAPI()
    }

    handleSimilarUser(){
      this.setState({
        similarUser: !this.state.similarUser
      })
      console.log(this.state.recomendations);

    }

    naturalQueryAPI(){
      this.setState({ isLoading: true })
  
      var str = this.state.query
      
      str = str.replace(" ", "%20")
  
      var url = ('https://api.nutritionix.com/v1_1/search/' + str + 
                  '?results=0:20&fields=item_name,brand_name,item_id,' + 
                  'nf_calories,nf_protein,nf_sugars,nf_total_fat,nf_total_carbohydrate' +
                  '')
  
      console.log(url)
  
      
      return fetch(url)
      .then ( (response) => response.json() )
      .then ( (responseJson) => {
  
        this.setState({
          isLoading: false,
          dataSource: responseJson.hits,
          hasSearched: true,
        })
        this.filterResults()
      })
      
  
      .catch((error) => {
        console.log(error)
      })
    }

    postData() {
      var data = {query: this.state.query}
      console.log("hello")
      
      this.setState({ isLoading: true })

      const response = fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST', 
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) 
      }).then ( (response) => response.json() )
      .then ( (responseJson) => {
      
      console.log(responseJson.foods.full_nutrients)
      this.setState({
        isLoading: false,
        dataSource: responseJson,
        hasSearched: true,
      }) 
    })
    };

    queryAPI() {
  
      this.setState({ isLoading: true })
  
      var str = this.state.query
      
      str = str.replace(" ", "%20")
  
      var url = ('https://api.nutritionix.com/v1_1/search/' + str + 
                  '?results=0:20&fields=item_name,brand_name,item_id,' + 
                  'nf_calories,nf_protein,nf_sugars,nf_total_fat,nf_total_carbohydrate' +
                  '&')
  
      console.log(url)
  
      
      return fetch(url)
      .then ( (response) => response.json() )
      .then ( (responseJson) => {
  
        this.setState({
          isLoading: false,
          dataSource: responseJson.hits,
          hasSearched: true,
        })
        this.filterResults()
      })
      
  
      .catch((error) => {
        console.log(error)
      })
    }

    filterResults(){
      var x = this.state.dataSource
      var z = []

      console.log(this.state.currentCal)

      for (var y in x) {
        if (x[y].fields.nf_calories 
            + this.state.currentCal 
            < this.state.maxCal) {
              z.push(x[y])
              console.log("hi")
            }
      }

      this.setState({
        dataSourceFiltered: z
      })

      console.log(z)
    }
  
    render() {
      var x = JSON.parse(JSON.stringify(this.state.recomendations))
      let y = Object.values(x)
  
      if (this.state.isLoading) {
        return (
          <View style={styles.main}>
            <ActivityIndicator />
          </View>
        )
      }

      if (!this.state.hasSearched && !this.state.similarUser) {
        return (
          <View>
              
          <TextInput  placeholder={this.state.useNatural ? "Natural Food Search" : "Food Search"} clearButtonMode='always'
              onFocus={this.handleFocus} onBlur={this.handleBlur} style={[styles.input, 
                {borderColor: this.state.isFocused ? '#5bc0de' : 'white',}]} 
                onChangeText={(text) => this.setState({query: text})}
                onSubmitEditing={!this.state.useNatural ? this.queryAPI : this.postData}>        
          </TextInput>

          <TouchableOpacity onPress={() => this.setState({useNatural: !this.state.useNatural})}
        style = {{width: "90%", marginLeft: '5%', marginTop: 30}}>
                <View style = {{alignItems: 'center', 
                                justifyContent: 'center', borderRadius: 20}}>
                    <Text style = {{color: '#147EFB'}}>{!this.state.useNatural ? "User Natural" : "Use Standard"}</Text>
                </View>
            </TouchableOpacity>

          <TouchableOpacity onPress={this.handleSimilarUser}
        style = {{width: "90%", marginLeft: '5%', marginTop: 5}}>
                <View style = {{alignItems: 'center', 
                                justifyContent: 'center', borderRadius: 20}}>
                    <Text style = {{color: '#147EFB', paddingVertical: 20}}>Similar User Suggestions</Text>
                </View>
            </TouchableOpacity>

          <Text style={{alignSelf:'center', fontSize:30, marginTop: 50}}><Icon name="ios-search" size={100} color="grey" /></Text>
          <Text style={{alignSelf:'center', fontSize:16, marginBottom: 70, color:"grey"}}>Search for food..</Text>

          <Text style={{alignSelf:'center', fontSize:16, marginBottom: 0, color:"grey"}}>Nearby Suggestions</Text>

          <FlatList scrollEnabled={true}
                data={this.state.nearbyRestaurants}
                style={{height:'40%', marginTop: '1%', backgroundColor: '#292b2c'}} 
                renderItem={({ item }) => 
                <TouchableWithoutFeedback onPress={this.useNearbySuggestion.bind(this, item.name)}>
                  <Text style={styles.restaurantResults}> 
                    {item.name}
                  </Text>
                </TouchableWithoutFeedback>
              }
                styles={{justifyContent: "center"}}
              />

      </View>
        )
      }

      else if (!this.state.hasSearched && this.state.similarUser) {
        return (
          <View>
              
          <TextInput  placeholder={this.state.useNatural ? "Natural Food Search" : "Food Search"} clearButtonMode='always'
              onFocus={this.handleFocus} onBlur={this.handleBlur} style={[styles.input, 
                {borderColor: this.state.isFocused ? '#5bc0de' : 'white',}]} 
                onChangeText={(text) => this.setState({query: text})}
                onSubmitEditing={this.queryAPI}>        
          </TextInput>

          <TouchableOpacity onPress={() => this.setState({useNatural: !this.state.useNatural})}
        style = {{width: "90%", marginLeft: '5%', marginTop: 30}}>
                <View style = {{alignItems: 'center', 
                                justifyContent: 'center', borderRadius: 20}}>
                    <Text style = {{color: '#147EFB'}}>{!this.state.useNatural ? "User Natural" : "Use Standard"}</Text>
                </View>
            </TouchableOpacity>

          <TouchableOpacity onPress={this.handleSimilarUser}
        style = {{width: "90%", marginLeft: '5%', marginTop: 10}}>
                <View style = {{alignItems: 'center', 
                                justifyContent: 'center', borderRadius: 20}}>
                    <Text style = {{color: '#147EFB', paddingVertical: 20}}>Nearby Suggestions</Text>
                </View>
            </TouchableOpacity>

          <Text style={{alignSelf:'center', fontSize:30, marginTop: 50}}><Icon name="ios-search" size={100} color="grey" /></Text>
          <Text style={{alignSelf:'center', fontSize:16, marginBottom: 70, color:"grey"}}>Search for food..</Text>

          <Text style={{alignSelf:'center', fontSize:16, marginBottom: 0, color:"grey"}}>Similar User Suggestions</Text>

          <FlatList scrollEnabled={true}
                data={y}
                style={{height:'40%', marginTop: '1%', backgroundColor: '#292b2c'}} 
                renderItem={({ item }) => 
                <TouchableWithoutFeedback onPress={this.useNearbySuggestion.bind(this, item)}>
                  <Text style={styles.restaurantResults}> 
                    {item}
                  </Text>
                </TouchableWithoutFeedback>
              }
                styles={{justifyContent: "center"}}
              />

      </View>
        )
      }

      else {
        
        try {
          var food = JSON.parse(JSON.stringify(this.state.dataSource[0].fields))
        }
        catch(err) {
          return (
  
            <View>
              
              <TextInput  placeholder="Food Search"
                  onFocus={this.handleFocus} onBlur={this.handleBlur} style={[styles.input, 
                    {borderColor: this.state.isFocused ? '#5bc0de' : 'white',}]} 
                    onChangeText={(text) => this.setState({query: text})}
                    onSubmitEditing={this.queryAPI}>        
              </TextInput>
  
              <Text style={{alignSelf:'center', fontSize:30, marginTop: 10}}>Item Not Found.</Text>
  
          </View> )
        }
        

      if (!this.state.unfilter)
        return (
  
          <View>
            
            <TextInput  placeholder="Food Search"
                onFocus={this.handleFocus} onBlur={this.handleBlur} style={[styles.input, 
                  {borderColor: this.state.isFocused ? '#5bc0de' : 'white',}]} 
                  onChangeText={(text) => this.setState({query: text})}
                  onSubmitEditing={this.queryAPI}>        
            </TextInput>
  
            <View style={{height: '87%'}}>
              <Text style={{alignSelf:'center', fontSize:35, marginTop: 0, marginBottom: 20}}>Results</Text>
              <Text style={[styles.email, {textAlign: "center"}]}>Following foods are within your calorie goal.</Text>
              <TouchableOpacity onPress={() => {this.setState({unfilter: true})
                                                 Alert.alert("These foods might have more calories than your goal.")}}
        style = {{width: "90%", marginLeft: '5%', marginTop: 10}}>
                <View style = {{alignItems: 'center', 
                                justifyContent: 'center', borderRadius: 20}}>
                    <Text style = {{color: '#147EFB', paddingVertical: 20}}>See More Results</Text>
                </View>
            </TouchableOpacity>
              <FlatList scrollEnabled={true}
                data={this.state.dataSourceFiltered}
                style={{marginBottom: 0}} 
                renderItem={({ item }) => 
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Item', {food: item})}>
                  <Text style={styles.searchResults}> 
                    {item.fields.item_name} - {item.fields.brand_name} 
                  </Text>
                </TouchableWithoutFeedback>
              }
                styles={{justifyContent: "center"}}
              />
               <TouchableOpacity onPress={() => this.setState({hasSearched: false})}>
               <Text style={{alignSelf:'center', fontSize:30, marginTop: 0}}><Icon name="ios-close" size={100} color="grey" /></Text>
              </TouchableOpacity>  

            </View>
          </View>
  
          
        );


      if (this.state.unfilter)
      return (

        <View>
          
          <TextInput  placeholder="Food Search"
              onFocus={this.handleFocus} onBlur={this.handleBlur} style={[styles.input, 
                {borderColor: this.state.isFocused ? '#5bc0de' : 'white',}]} 
                onChangeText={(text) => this.setState({query: text})}
                onSubmitEditing={this.queryAPI}>        
          </TextInput>

          <View style={{height: '87%'}}>
            <Text style={{alignSelf:'center', fontSize:35, marginTop: 0, marginBottom: 20}}>Results</Text>
            <Text style={[styles.email, {textAlign: "center"}]}>Some of these foods might exceed your calorie goal.</Text>
            <TouchableOpacity onPress={() => {this.setState({unfilter: false}) }}
      style = {{width: "90%", marginLeft: '5%', marginTop: 10}}>
              <View style = {{alignItems: 'center', 
                              justifyContent: 'center', borderRadius: 20}}>
                  <Text style = {{color: '#147EFB', paddingVertical: 20}}>See Filtered Results</Text>
              </View>
          </TouchableOpacity>
            <FlatList scrollEnabled={true}
              data={this.state.dataSource}
              style={{marginBottom: 0}} 
              renderItem={({ item }) => 
              <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Item', {food: item})}>
                <Text style={styles.searchResults}> 
                  {item.fields.item_name} - {item.fields.brand_name} 
                </Text>
              </TouchableWithoutFeedback>
            }
              styles={{justifyContent: "center"}}
            />
             <TouchableOpacity onPress={() => this.setState({hasSearched: false})}>
             <Text style={{alignSelf:'center', fontSize:30, marginTop: 0}}><Icon name="ios-close" size={100} color="grey" /></Text>
            </TouchableOpacity>  

          </View>
        </View>

        
      );

      }
    }
  }

  export default FoodScreen