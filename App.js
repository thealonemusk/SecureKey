// Desc: Main entry point for the app
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider , MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/login.js';
import Home from './screens/home.js';
import SignupScreen from './screens/singup.js';


const Stack = createNativeStackNavigator();



export default function App() {


  return (
    <NavigationContainer>
      <PaperProvider >
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{headerShown:false, statusBarHidden:true}} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

