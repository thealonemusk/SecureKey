import { View , Dimensions, StyleSheet , ScrollView , Image} from 'react-native';    
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from 'react';
import { TextInput, Button, HelperText, Avatar } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';
import SgnSVG from '../assets/signin.svg';




const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Login({navigation}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const getUsername = (email) => {
        for(let i = 0;i<email.length;i++){
            if(email[i]==='@' || email[i]==='.' || email[i]==='-'|| email[i]==='_'){
                return email.slice(0,i);
            }
        }
    }


    const handleLogin = () => {
        // handle login logic here
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;
            const user_name = getUsername(user.email);
            navigation.navigate('Home', {uid:uid , user_name:user_name});
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
            })
        })
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={style.loginPage}>
                    <SgnSVG width={width} height={height/5} />
                    <TextInput style={style.inputDeco}
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput style={style.inputDeco}
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <HelperText type="info" visible={true}>password must be atleast 6 characters long</HelperText>
                    <Button onPress={handleLogin} style={style.btnDeco} mode="contained">Login</Button>
                    {/* <Button onPress={()=>{}} style={style.btnDeco} mode="outlined">Login with Google</Button> */}
                    <Button onPress={()=>{navigation.navigate('Signup')}} style={style.btnDeco} mode="outlined">Sign up</Button>
                    <Toast/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    loginPage:{
        justifyContent: 'center',
        height: height,
        width: width,
        padding:20
    },
    inputDeco:{
        marginTop:10,
        backgroundColor: 'transparent',
    },
    btnDeco:{
        margin:10,
    }
})

export default Login;