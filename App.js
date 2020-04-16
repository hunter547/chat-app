import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// Import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';
// Create a navigator that will take care of routing the Screens declared previoulsy
const navigator = createStackNavigator({
  Start: { screen: Start, navigationOptions: {
             headerShown: false
           } },
  Chat: { screen: Chat, navigationOptions: {
             headerTintColor: '#fff',
             headerTitleStyle: {
               fontFamily: 'Poppins-SemiBold',
               fontSize: 25
             }
          } }
}),

// Create a container the entire app will sit in and that will change based on the current navigation
navigatorContainer = createAppContainer(navigator);



export default navigatorContainer;