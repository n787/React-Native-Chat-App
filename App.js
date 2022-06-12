//@refresh reset
import { async } from '@firebase/util';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, TextInput, View, YellowBox } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { db } from './src/firebase';
import 'firebase/firestore'

YellowBox.ignoreWarnings(['Setting a timer for a long period of time']);


const App = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [messages, setMessages] = useState();
  if (db === undefined) {
    console.log('DB is not ready....');
  }
    const chatRef = db.collection('chats');  


  useEffect(() => { 
    readUser();
     const unsubscriber = chatRef.onSnapshot((querySnapshot) => {
       const messageFirestore = querySnapshot.doChanges()
         .filter(({ type }) => type === 'added')
        .map(({ doc }) => {
          const message = doc.data();
          return {
            ...message, createdAt: message.createdAt.toDate()}
        }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
       setMessages(messageFirestore);
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

  async function handleSend(messages) {
    const writes = messages.map(m => chatRef.add(m))
    await Promise.all(writes)
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
      <GiftedChat messages={ messages } user={user} onSend={handleSend} />
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
