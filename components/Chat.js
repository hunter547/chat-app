import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { Header } from 'react-navigation-stack';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NetInfo from '@react-native-community/netinfo';
import * as Font from 'expo-font';
const firebase = require('firebase');
require('firebase/firestore');

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
    this.referenceMessages = firebase.firestore().collection('messages');
    this.state = {
      assetsLoaded: false,
      messages: [],
      color: this.props.navigation.getParam('color'),
      isConnected: false
    }
  }

  async componentDidMount() {
    NetInfo.fetch().then(state => {
      var isConnected = state.isConnected;
      this.setState({
        isConnected
      });
      this.getMessages();
      if (isConnected) {
        this.unsubscribe = this.referenceMessages.orderBy('createdAt','desc').onSnapshot(this.onCollectionUpdate);
      }
    });
    await Font.loadAsync({
      'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf')
    });
    this.setState({
      assetsLoaded: true,
    })
  }

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      messages.push({
        _id: doc.id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: data.user
      });
    });
    this.setState({
      messages
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
    });
    this.addMessage(messages)
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  addMessage(message) {
    const {_id, createdAt, text, user} = message[0];
    this.referenceMessages.add({
      _id: _id,
      createdAt: createdAt,
      text: text,
      user: {
        _id: user._id,
        avatar: user.avatar,
        backgroundColor: user.backgroundColor,
        name: user.name
      }
    })
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: props.currentMessage.user.backgroundColor
          }
        }}
      />
    );
  }

  renderInputToolbar = props => {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  render() {
    const { navigation } = this.props;
    const { assetsLoaded } = this.state;
    if (assetsLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {Platform.OS === 'android' ? (
            <KeyboardAvoidingView style={{ flex: 1 }}>
              <GiftedChat
                messages={this.state.messages}
                placeholder='Type a message...'
                renderBubble={this.renderBubble}
                renderInputToolbar={this.renderInputToolbar}
                onSend={messages => this.onSend(messages)}
                user={{
                  _id: navigation.getParam('uid'),
                  backgroundColor: navigation.getParam('color'),
                  name: navigation.getParam('name'),
                  avatar: ''
                }}
                showUserAvatar={true}
              />
            </KeyboardAvoidingView>)
            : (
              <GiftedChat
                messages={this.state.messages}
                placeholder='Type a message...'
                renderBubble={this.renderBubble}
                renderInputToolbar={this.renderInputToolbar}
                onSend={messages => this.onSend(messages)}
                user={{
                  _id: navigation.getParam('uid'),
                  backgroundColor: navigation.getParam('color'),
                  name: navigation.getParam('name'),
                  avatar: ''
                }}
                showUserAvatar={true}
              />
            )}
        </View>
      );
    }
    else {
      return (
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