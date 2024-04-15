import { SafeAreaView } from "react-native-safe-area-context";
import { useState , useEffect , useRef} from 'react';
import { View , StyleSheet , Dimensions, ScrollView} from 'react-native';
import { TextInput, Button , HelperText } from 'react-native-paper'
import * as Notifications from 'expo-notifications';
import { createUserWithEmailAndPassword } from "firebase/auth";
import Toast from 'react-native-toast-message';
import { auth } from '../firebaseConfig.js';
import SgnUpSVG from '../assets/signup.svg';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function SignupScreen({navigation}) {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const getUsername = (email) => {
      for(let i = 0;i<email.length;i++){
          if(email[i]==='@' || email[i]==='.' || email[i]==='-'|| email[i]==='_'){
              return email.slice(0,i);
          }
      }
  }

    const handleSignup = async () => {
        // handle SignupScreen logic here
        await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
          const user = userCredential.user;
          const user_name = getUsername(user.email);
          const uid = user.uid;
          try{
            fetch(`https://key-api-production.up.railway.app/users`,{
              method:'POST',
              headers:{
                'Content-Type':'application/json'
              },
              body:JSON.stringify({
                uid:uid,
                password:[],
                username:[],
                website:[],
              })
            })
          }
          catch(error){
            console.log(error);
          }
          finally{
            navigation.navigate('Home' , {uid:uid , user_name:user_name});
            schedulePushNotification();
          }
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          Toast.show({
              type:'error',
              text1: errorMessage.split(':')[1],
              position: 'top',
              visibilityTime: 4000,
              autoHide: true,
              onHide:()=>{
                navigation.navigate('Login');
              }
          })
        });
    };

    return (
        <SafeAreaView>
          <ScrollView>
            <View style={style.SignupPage}>
                <SgnUpSVG width={width} height={height/5}/>
                <TextInput style={style.inputDeco}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                />
                <TextInput style={style.inputDeco}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCompleteType="password"
                    textContentType="password"
                />
                <HelperText type="info" visible={true}>password must be of 6 characters long</HelperText>
                <Button mode="contained" onPress={handleSignup} style={style.btnDeco}>Sign up</Button>
                <Toast/>
            </View>
          </ScrollView>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    SignupPage:{
        justifyContent: 'center',
        height: height,
        width: width,
        padding:10
    },
    inputDeco:{
        margin:10,
        backgroundColor: 'transparent',
    },
    btnDeco:{
        margin:10,
    }
})

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Welcome Onboard! 🎉👋",
        body: 'do not store bank details here',
        data: { data: 'goes here'},
      },
      trigger: { seconds: 2 },
    });
}

async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync({ projectId: '467193a9-aa5a-4634-8b45-b819d9ff7cd0' })).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
}

export default SignupScreen;