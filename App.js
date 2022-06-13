//@refresh reset
import { async } from '@firebase/util';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, TextInput, View, LogBox } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
//import { db } from './src/firebase';
import * as firebase from 'firebase';


//LogBox.ignoreWarnings(['Setting a timer for a long period of time']);

const firebaseConfig = {
  apiKey: "AIzaSyA-cqkW440w5Y2exOys3D75h5AeCGLL4To",
  authDomain: "react-native-chat-app-12077.firebaseapp.com",
  projectId: "react-native-chat-app-12077",
  storageBucket: "react-native-chat-app-12077.appspot.com",
  messagingSenderId: "90988010737",
  appId: "1:90988010737:web:d6e982216c4d871bb1dd50"
};

if (!firebase.apps.lenght) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const db = firebase.firestore();

const chatRef = db.collection('chats');  


const App = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]); 
  
  useEffect(() => {
    readUser();
    /* const unsubscriber = chatRef.onSnapshot((querySnapshot) => {
       const messageFirestore = querySnapshot.doChanges()
         .filter(({ type }) => type === 'added')
         .map(({ doc }) => {
           const message = doc.data();
           return {
             ...message, createdAt: message.createdAt.toDate()
           }
         }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      setMessages(messageFirestore);
    }); */
         
       const unsubscribe = chatRef.onSnapshot(querySnapshot => {
         setMessages(
           querySnapshot.docs.map(doc => ({
             id: doc.data().id,
             createdAt: doc.data().createdAt.toDate(),
             text: doc.data().text,
             user: doc.data().user
           }))
         );
       });
   
       return () => unsubscribe(); 
  }, []);  
  
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
    const { id, createdAt, text, user } = messages[0];    
   /* addDoc(chatRef, {
      id,
      createdAt,
      text,
      user
    }); */
    chatRef.add({
      id: id,
      createdAt: createdAt,
      text: text,
      user: user
    }).then(() => {
      console.log('message added!');
    });
  }, []);

  async function readUser() {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }

  async function handleOnPress() {
    console.log("User started a chat...");
    const id = Math.random().toString(36).substring(7);
    const user = { id, name }
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }
  
  if (!user) {
      return (
        <View style={styles.container}>
          <TextInput style={styles.input} 
            placeholder='Enter your name'
            value={name}
            onChangeText={tx =>(setName(tx))}
          />
          <Button style={styles.btnStart} title='Start Chat' onPress={handleOnPress}/>
        </View>
      );
  }
  
  
  return (
    <GiftedChat messages={messages}
      showAvatarForEveryMessage={true}
      user={user}
      onSend={messages => onSend(messages)} 
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    padding: 15,
    borderColor: 'gray',
  },
  btnStart: {
    margin: 10,

  }

});

export default App;
