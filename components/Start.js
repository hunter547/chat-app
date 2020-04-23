import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import Icon from '../assets/personIcon';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Font from 'expo-font';
const firebase = require('firebase');
require('firebase/firestore');
import firebaseConfig from './configs/firebaseConfig';



export default class Start extends React.Component {

  constructor(props) {
    super(props);
    firebase.initializeApp(firebaseConfig);
    this.state = {
      name: '',
      colorSelected: '',
      colors: [
        '#090C08',
        '#474056',
        '#8A95A5',
        '#B9C6AE'
      ],
      assetsLoaded: false,
      uid: ''
    }
  }

  async componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    
      //update user state with currently active user data
      this.setState({
        uid: user.uid
      });
    });
    
    await Font.loadAsync({
        'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
        'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
      });
    this.setState({ assetsLoaded: true })
  }

  componentWillUnmount() {
    this.authUnsubscribe();
  }

  render() {
    const { navigation } = this.props;
    const { name, colors, colorSelected, assetsLoaded, uid } = this.state;
    if (assetsLoaded) {
      return (
        <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.backgroundImage}>
          <Text style={styles.title}>Bobchat</Text>
          <View style={styles.controlPanel}>
            <View style={styles.searchView}>
              <Icon />
              <TextInput style={styles.nameInput}
                accessible={true}
                accessibilityLabel='Input handle...'
                accessibilityHint='This handle will be used to identify you by other members'
                accessibilityRole= 'text'
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder='Input handle...                                      '
              />  
            </View>
            {Platform.OS === 'android' ? <KeyboardSpacer /> : null } 
            <Text style={styles.chooseText}>
              Choose Background Color:
            </Text>
            <View style={styles.colorPicker}>
              {colors.map(color => (
                <View style={[styles.buttonBorder,
                colorSelected === color ? { borderColor: '#757083' } : null]}
                  key={color}>
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel='Select your background color'
                    accessibilityHint='The color selected will be your header and chat message color'
                    accessibilityRole='button'
                    onPress={() => this.setState({ colorSelected: color })}
                    style={[styles.colorButton,
                    { backgroundColor: color }]}
                  />
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Chat', { name, color: colorSelected, uid})}
              style={[styles.chatButton]}
              accessible={true}
              accessibilityLabel='Start chatting'
              accessibilityHint='Clicking the button will enter the chat screen where you can connect with other users.'
              accessibilityRole='button'>
              <Text style={styles.chatButtonText}>
                Start Chatting
              </Text>
            </TouchableOpacity>
          </View> 
        </ImageBackground >
      )
    }
    else {
      return (
        <Text>Loading</Text>
      )
    }
    
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  title: {
    fontSize: 45,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    alignItems: 'center',
    flex: 1,
    marginTop: 130
  },
  controlPanel: {
    width: '88%',
    height: '44%',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    alignItems: 'flex-start'
  },
  chatButton: {
    backgroundColor: '#757083',
    width: '88%',
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 50,
    marginBottom: 20
  },
  chatButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF'
  },
  searchView: {
    width: '88%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#757083',
    marginTop: 15,
    marginBottom: 30,
    marginLeft: 20,
    paddingLeft: 13
  },
  nameInput: {
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    color: '#757083',
    opacity: .9,
    padding: 15
  },
  chooseText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#757083',
    opacity: .9,
    marginLeft: 20
  },
  colorPicker: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '70%',
    margin: 20
  },
  colorButton: {
    height: 44,
    width: 44,
    borderRadius: 22
  },
  buttonBorder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    padding: 3,
    borderWidth: 3,
    borderRadius: 100,
    borderColor: '#fff',
  }

});