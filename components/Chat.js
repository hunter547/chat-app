import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
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
      assetsLoaded: false,
      messages: [],
      color: this.props.navigation.getParam('color')
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf')
    });
    this.setState({
      assetsLoaded: true,
      messages: [
        {
          _id: 1,
          text: `Hello ${this.props.navigation.getParam('name')}! Welcome to the chat!`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png'
          }
        },
        {
         _id: 3,
         text: `${this.props.navigation.getParam('name')} connected to the chat.`,
         createdAt: new Date(),
         system: true,
        },
      ],
      
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }))
  }

  renderBubble(props) {
    return(
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

  render() {
    const { navigation } = this.props;
    const { assetsLoaded } = this.state;
    if (assetsLoaded) {
      return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          placeholder='Type a message...'
          renderBubble={this.renderBubble}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
            backgroundColor: navigation.getParam('color'),
            name: navigation.getParam('name'),
            avatar: 'https://cdn.icon-icons.com/icons2/1371/PNG/512/batman_90804.png'
          }}
          showUserAvatar={true}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null }  
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