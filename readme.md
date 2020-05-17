# Bobchat :tw-1f4f1:
A react native application utilitzing gifted-chat and Google Firebase to offer a real-time chat experience on iOS and Android.
## Getting started

#### Install NodeJS and Expo
For the project to run, [Node.js](https://nodejs.org/en/ "NodeJs") needs to be downloaded to your computer. You will also need to install the Expo CLI in your terminal with this command:

`
npm install expo-cli --global
`

Also download the Expo app on your mobile device, so that you can run the app directly from the Expo app.

#### Setup Expo
Now, you need an Expo account. Head over to the [Expo sign-up page](https://expo.io/signup) and follow the instructions to create an account. Once that's done, you should be able to log in to Expo from your browser as well as the mobile app. At some point, youll be asked to log in to the Expo CLI, so do that, too, when it comes up.

#### Setting up a simulator for iOS
In order for the iOS simulator to run this app, [Xcode](https://developer.apple.com/xcode/resources/ "Xcode") needs to be installed. After installing XCode, open it up and head over to "Preferences." From there, click "Components" and install a simulator from the list. Open the simulator, start your Expo project, and click "Run on iOS simulator" or simply type "i" in the Expo CLI.

#### Setting up an emulator for Android
To set up Android Emulator, you first need to download and install [Android Studio](https://docs.expo.io/versions/v32.0.0/workflow/android-studio-emulator/ "Android Studio"). To do this, follow the on-screen installation instructions and make sure you **don't** untick the "Android Virtual Device" option in the installation dialog.

After the installation is complete, start Android Studio, click "Configure" and go to Settings -> Appearance & Behaviour -> System Settings -> Android SDK. Click the "SDK Tools" tab and check that you have "Android SDK Build-Tools" installed. If your "Android SDK Build-Tools" aren't installed, click on the "Android SDK Build-Tools” row, then download the latest version by clicking on the download symbol that appears next to it.

**macOS and Linux only:** 
You need to add the location of the Android SDK to your PATH. To do so, copy the path (in the picture above, it’s the path next to “Android SDK Location”) and add the following to your “~/.bashprofile” or “~/.bashrc” file:

`export ANDROID_SDK=/Users/myuser/Library/Android/sdk`

Make sure to edit the path in the line above because it will look different for you.

**macOS only:**
You also need to add platform-tools to your “~/.bashprofile” or “~/.bashrc” file. To do this, add:

`export PATH=/Users/myuser/Library/Android/sdk/platform-tools:$PATH`

Again, make sure to edit the path in the line above because it will look different for you.

##### Installing and running the Android Emulator
Close the "Settings for New Projects" window and click "Configure" again. This time, however, select "AVD Manager" then "Create Virtual Device" and, finally, a phone from the list. Go ahead and pick whichever device you want, then click "Next".
This will take you to the "System Image" interface. Click on the "Recommended" tab and select an operating system.

Click the “Download” link next to whichever OS you want to install. Android Studio will download that image for you, which might take a few minutes. In the next window, give your device a name, then click “Finish.”

Now, head back to the Virtual Device Manager and click “Play” to start your newly created emulator. Finally, head to the "Browser" tab of the project you're currently running in Expo and click "Run on Android device/emulator." Expo will start installing the Expo client on your virtual device and start your project.

##Setting up Firebase
To get started, head over to [Google Firebase](https://firebase.google.com/ "Google Firebase") and click on "Sign in" in the upper-right corner. Use your existing Google credentials to sign in and create a new Firebase account. If you don't have a Google account, create one now.

Next, click on the "Go to console" link, which is also in the top-right corner of the window, and click on "Create Project" (or "Add project" if you've created Firebase projects before). A form will appear asking you to fill basic in information about your new project. The default account on the last step.

####Setting up Firebase Database

Once the dashboard appears after creating your project, click the "Database" item in the left navbar. Then click "Create database" and select the "Start in test mode" option. This will allow users to read from and write to your database. Select a database location central to you or your user base.

####Setting up Firebase Storage

In order for images to be sent and stored, the Firebase Storage needs to be setup. Click the "Storage" item in the left navbar. Then click "Get started", then "Next", and, finally, "Done".

####Setting up Firebase Authentication

Users will need to be properly authenticated in order for them to send and store messages to other users. To set this up head back to the dashboard and click "Authentication" in the left navbar. Then click "Setup sign-in method" and enable the list item "Anonymous".

####Generating an API Key

In order for this app to gain access to your newly created Firebase project, you need to generate an API key. To do this, head over to Project Settings from the top of the left navbar and in the General tab, click on the "Create web app" button, which may just look like this: </>. Once the modal appears, give your app a name and click "Register app" (Firebase hosting not necessary).

Once registered, you will get a code snippet that looks something like this:
```HTML
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.14.4/firebase-analytics.js"></script>

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCMphASS75dv5mXXx18JOgvXwRz8LbN6Qc",
    authDomain: "testchat-5f8e8.firebaseapp.com",
    databaseURL: "https://testchat-5f8e8.firebaseio.com",
    projectId: "testchat-5f8e8",
    storageBucket: "testchat-5f8e8.appspot.com",
    messagingSenderId: "655102562368",
    appId: "1:655102562368:web:34e1a16546f498f1b00fa5",
    measurementId: "G-N5CYP8ZEX6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>
```

Copy everything within the curly brackets of the firebaseConfig variable. After cloning or downloading this repository, navigate to components/configs/firebaseConfig, delete everything within the curly brackets and paste your api key information in its place.

## Finishing up

All the configuration is now complete and your able to run the chat app. Navigate to the cloned or downloaded repository in your terminal and type:

`expo start`

Then chose either the iOS simulator by typing "i" into the terminal, or "a" in the terminal for the Android emulator (note: the Android emulator has to already be running by clicking play on the AVD manager).

To run the application on your mobile device:
**iPhone:**
Open the camera app and focus it on the QR code in either the Metro Bundler or the one generated in the terminal.

**Android:**
Using the Expo Client app for Android, scan the QR code in either the Metro Bundler or the one generated in the terminal.

Open the app, provide a username and background color, and then start chatting!






