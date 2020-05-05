import React, { Component, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Observable } from 'rxjs';
import firebase from "firebase";
import "firebase/firestore";

var progress = 0;

export default class CustomActions extends Component {

  onActionPress = () => {
    const options = ['Send Image', 'Take a Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
          default:
        }
      },
    );
  };

  pickImage = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        }).catch(error => console.log(error));

        if (!result.cancelled) {
          this.storeImage(result.uri); 
          
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'Images',
        }).catch(error => console.log(error));

        if (!result.cancelled) {
          this.storeImage(result.uri);
        }
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  storeImage = async (uri) => {
    try {
      const { props } = this.props;
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      // Give a unique name to the image
      const uriParse = uri.split('/');
      const uriName = uriParse[uriParse.length - 1];

      const promise = [];
      const ref = firebase.storage().ref();
      const uploadTask = ref.child(`${uriName}`).put(blob);
      var progress = Observable.interval(700).subscribe( _ => this.props.onSend({
        progress: Math.round((uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes)* 100),
        upload: true
      }));
      promise.push(uploadTask);

      Promise.all(promise).then( async tasks => {
        progress.unsubscribe();
        blob.close();
        const imageUrl = await uploadTask.snapshot.ref.getDownloadURL()
        this.props.onSend({ image: imageUrl })
      });

    }
    catch (error) {
      console.log(error);
    }
  }

  intervalTest = () => {
    progress += 20;
    this.props.onSend({
      progress,
      upload: true
    });
    
    if (progress < 100) {
      setTimeout(this.intervalTest, 700)
    }
    else if (progress = 100) {
      progress = 0;
    }
  }

  monitorFileUpload = task => {
    task.on('state_changed', function (snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + Math.round(progress) + '% done.');
      
      switch (snapshot.state) {
        case firebase.storage.TaskState.RUNNING:
          break;
      }
    }, function (error) {
      console.log(error);
    }, async function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    });
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});

      if (result) {
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude
          }
        })
      }
    }
  }

  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};