import React from 'react'
import styles from './StyleSheet'
import firebase from 'firebase'
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      profilePic: ""

    }
  }
  
  componentDidMount() {
    var uId = firebase.auth().currentUser.uid;
    this.setState({ userId: uId.toString() }) 
    firebase.database().ref('users/' + uId).once('value', function (snapshot){
      this.setState({ firstName: snapshot.val().first_name.toString(),
                      lastName: snapshot.val().last_name.toString(),
                      email: snapshot.val().gmail.toString(),
                      profilePic: snapshot.val().profile_picture.toString() }) 
                    }.bind(this))
  }

  onChooseImagePress = async () => {
    var result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancellled) {
      this.uploadImage(result.uri, this.state.email)
        .then(() => {
          Alert.alert("Image Uploaded");
        })
        .catch((error) => {
          Alert.alert(error);
        });
    }

  }

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child("images/" + imageName);
          console.log(ref.getDownloadURL())
    return ref.put(blob)
  }

    render() {
      return (
        <View style={styles.ProfileScreen}>
          <Text style={styles.ProfileScreenName}>{ this.state.firstName } { this.state.lastName}</Text>
          <Image style={styles.ProfileScreenPhoto} source={{uri: this.state.profilePic }} />
          <Text style={styles.email}>{this.state.email}</Text>
          <View style={styles.profileButtons}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('History')} style = {{width: "75%", margin: 15}}>
                  <View style = {{backgroundColor: '#0099ff', alignItems: 'center', 
                                  justifyContent: 'center', borderRadius: 20}}
                        >
                      <Text style = {{color: 'white', paddingVertical: 20}}>View History</Text>
                  </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Update')} style = {{width: "75%", margin: 15}}>
                  <View style = {{backgroundColor: 'black', alignItems: 'center', 
                                  justifyContent: 'center', borderRadius: 20}}
                        >
                      <Text style = {{color: 'white', paddingVertical: 20}}>Update Model</Text>
                  </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Logout')} style = {{width: "75%", margin: 15}}>
                  <View style = {{backgroundColor: '#ff3333', alignItems: 'center', 
                                  justifyContent: 'center', borderRadius: 20}}
                        >
                      <Text style = {{color: 'white', paddingVertical: 20}}>Logout</Text>
                  </View>
            </TouchableOpacity>
          </View>
      </View>
      );
    }
}

export default ProfileScreen