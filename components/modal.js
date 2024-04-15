
import { Modal, Portal, Text, Button, PaperProvider, TextInput , HelperText} from 'react-native-paper';
import { View , StyleSheet , Dimensions} from 'react-native';
import { useState } from 'react';
import Toast from 'react-native-toast-message';


const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const MyModal = ({visible,setVisible, addData }) => {
    const [website, setwebsite] = useState('');
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    const addNewData = () => {
        console.log("add new data");
        addData(website,username,password);
        setVisible(false);
    }


  if(!visible){
    console.log("modal not visible");
    return null;
  }
  return (
        <Modal visible={visible} onDismiss={()=>{setVisible(false)}} >
          <View style={style.modalView}>
                <TextInput style={style.inputDeco}
                    label="website"
                    value={website}
                    onChangeText={setwebsite}
                    keyboardType="website-address"
                    autoCapitalize="none"
                />
                <TextInput style={style.inputDeco}
                    label="username"
                    value={username}
                    onChangeText={setusername}
                    secureTextEntry
                />
                <TextInput style={style.inputDeco}
                    label="password"
                    value={password}
                    onChangeText={setpassword}
                    secureTextEntry
                />
                <HelperText type="info" visible={true}>username must be atleast 6 characters long</HelperText>
                <Button onPress={addNewData} style={style.btnDeco} mode="contained">Add Password</Button>
                <Toast/>
            </View>
        </Modal>
  );
};

const style = StyleSheet.create({
    modalView:{
        justifyContent: 'center',
        padding:20,
        backgroundColor: 'white',
        margin:20,
        borderRadius:20,
    },
    inputDeco:{
        marginTop:10,
        backgroundColor: 'transparent',
    },
    btnDeco:{
        margin:10,
    }
})

export default MyModal;