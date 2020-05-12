import firebase from 'firebase'


export function Set(path, dict){
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + path).set(dict)
}

export function Get(path, )