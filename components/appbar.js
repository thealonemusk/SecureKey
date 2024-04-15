import * as React from 'react';
import { Platform } from 'react-native';
import  { Appbar, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';


const MyAppBar = ({user_name , navigation , handleAdd}) => {

    const onLogout = async () => {
        try{
            await auth.signOut();
            console.log("logout");
            navigation.navigate('Login');
        }catch(err){
            console.log(err);
        }
    }


    return (
        <SafeAreaView >
            <Appbar.Header mode={Platform.OS==="ios"?'center-aligned':'small'}  statusBarHeight={0} >
                <Appbar.Content title={"Hi " + user_name} />
                <Appbar.Action icon="plus" onPress={handleAdd} />
                <Appbar.Action icon="logout" onPress={onLogout} />
            </Appbar.Header>
        </SafeAreaView>
    );
}



export default MyAppBar;