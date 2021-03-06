import React from 'react';
import {
  StyleSheet, Text, View, KeyboardAvoidingView, AsyncStorage, YellowBox,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import * as Font from 'expo-font';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

import PercentageSVG from '../assets/percentageWheel';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = `Hi ${navigation.getParam('name')}!`;
    return {
      title,
      headerStyle: {
        backgroundColor: navigation.getParam('color'),
      },
    };
  }

  constructor(props) {
    super(props);
    this.referenceMessages = firebase.firestore().collection('messages');
    this.state = {
      assetsLoaded: false,
      messages: [],
      isConnected: false,
    };
  }

  async componentDidMount() {
    try {
      NetInfo.fetch().then((state) => {
        const { isConnected } = state;
        this.setState({
          isConnected,
        });
        this.getMessages();
        if (isConnected) {
          this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        }
      });
      await Font.loadAsync({
        'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
      });
      this.setState({
        assetsLoaded: true,
      });

      // The line below solves an issue with react-native timers in Android: https://stackoverflow.com/a/54798303
      YellowBox.ignoreWarnings(['Setting a timer']);
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
  * Create a messages array that gets pushed to for each document in the querySnapshot parameter.
  * Set the messages state to the created messages array.
  * @function onCollectionUpdate
  * @param {Array} querySnapshot A snapshot of the messages collection returned from firebase.
  */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        _id: doc.id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: data.user,
        image: data.image,
        location: data.location,
      });
    });
    this.setState({
      messages,
    });
  }

  /**
  * When a text message or location is being sent, the message is appended to the messages state
  * and saved to storage. If an image is being sent, data about the upload progress will be used.
  * @param {Object} messages The current message being sent via the "Send" button.
  */
  onSend(messages = []) {
    if (!messages[0].upload) {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }), () => {
        this.saveMessages();
      });
      this.addMessage(messages);
    } else {
      const newMessages = this.state.messages;
      if (newMessages.length > 0 && newMessages[0].upload === true) {
        messages[0].createdAt = newMessages[0].createdAt;
        newMessages.shift();
      }
      this.setState({
        messages: GiftedChat.append(newMessages, messages[0]),
      });
    }
  }

  /**
  * Gets all messages from AsycStorage and sets the messages state to the returned item
  * @async
  * @return {Promise<string>} The messages item from async storage
  */
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      if (messages.length > 0) {
        this.setState({
          messages: JSON.parse(messages),
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Saves the messages state to AsyncStorage.
  * @async
  */
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Delete the messages state from AsyncStorage.
  * @async
  */
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Fired from the onSend() function and adds the new message to the firebase messages collection
  * @param {Object} message The current message object being sent
  */
  addMessage(message) {
    console.log(message[0]);
    const {
      _id, createdAt, text, user, image, location,
    } = message[0];
    this.referenceMessages.add({
      _id,
      createdAt,
      text: text || null,
      user: {
        _id: user._id,
        avatar: user.avatar,
        backgroundColor: user.backgroundColor,
        name: user.name,
      },
      image: image || null,
      location: location || null,
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: props.currentMessage.user.backgroundColor,
          },
        }}
      />
    );
  }

  renderInputToolbar = (props) => {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      const latitude = parseInt(currentMessage.location.latitude);
      const longitude = parseInt(currentMessage.location.longitude);
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    if (currentMessage.upload) {
      return (
        <View style={{ margin: 3, paddingTop: 10 }}>
          <PercentageSVG percentage={currentMessage.progress} />
        </View>
      );
    }
    return null;
  }

  renderActions = (props) => <CustomActions {...props} />;

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
                placeholder="Type a message..."
                renderBubble={this.renderBubble}
                renderInputToolbar={this.renderInputToolbar}
                renderCustomView={this.renderCustomView}
                renderActions={this.renderActions}
                onSend={(messages) => this.onSend(messages)}
                user={{
                  _id: navigation.getParam('uid'),
                  backgroundColor: navigation.getParam('color'),
                  name: navigation.getParam('name'),
                  avatar: '',
                }}
                showUserAvatar
              />
            </KeyboardAvoidingView>
          )
            : (
              <GiftedChat
                messages={this.state.messages}
                placeholder="Type a message..."
                renderBubble={this.renderBubble}
                renderInputToolbar={this.renderInputToolbar}
                renderCustomView={this.renderCustomView}
                renderActions={this.renderActions}
                onSend={(messages) => this.onSend(messages)}
                user={{
                  _id: navigation.getParam('uid'),
                  backgroundColor: navigation.getParam('color'),
                  name: navigation.getParam('name'),
                  avatar: '',
                }}
                showUserAvatar
              />
            )}
        </View>
      );
    }

    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 40,
  },
  messageField: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#757083',
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 50,
    marginBottom: 20,
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});
