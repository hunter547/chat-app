import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';

export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = 'Hi ' + navigation.getParam('name') + '!';
    return {
      title,
      headerStyle: {
        backgroundColor: navigation.getParam('color')
      }
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      assetsLoaded: false
    }
  }

  alertMyText(input = []) {
    Alert.alert(input.text);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf')
    });
    this.setState({
      assetsLoaded: true
    })
  }

  render() {
    const { navigation } = this.props;
    const { text, assetsLoaded } = this.state;
    if (assetsLoaded) {
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.messageField}
            onChangeText={(message) => this.setState({ text: message })}
            value={this.setState.text}
            placeholder='Type here' />
          <TouchableOpacity onPress={() => this.alertMyText({text})}
              style={[styles.sendButton]}>
              <Text style={styles.sendButtonText}>
                Send
              </Text>
            </TouchableOpacity>
        </View>
      );
    }
    else {
      return(
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 40
  },
  messageField: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20
  },
  sendButton: {
    backgroundColor: '#757083',
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 50,
    marginBottom: 20
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF'
  }
})