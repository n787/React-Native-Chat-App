//@refresh reset
import { async } from '@firebase/util';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, TextInput, View, YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Setting a timer for a long period of time']);

const App = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => { 
    readUser();
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
    <View style={styles.container}>
      <Text>We have user here!</Text>
      <StatusBar style="auto" />
    </View>
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
