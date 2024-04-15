import React, { useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { TextInput , Button } from "react-native-paper";

function ModalTester({isModalVisible,setModalVisible, data , updateData , indexAt}) {
  const [password, setPassword] = useState(data.password);
  const [username, setUsername] = useState(data.username);
  const [website, setWebsite] = useState(data.website);


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    }

    const updateChanges = () => {
      console.log("indexAt :" + indexAt)
        console.log("update changes");
        data.password = password;
        data.username = username;
        data.website = website; 
        console.log(indexAt);
        updateData(data,indexAt);
        toggleModal();
    }

  return (
    <View style={styles.flexView}>
      <StatusBar />

      <Modal
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationIn="fadeInUpBig"
        animationOut="fadeOutDownBig"
        animationInTiming={900}
        animationOutTiming={500}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={500}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.center}>
            <View style={styles.barIcon} />
          </View>
          <View style={{flex:1,justifyContent:'center'}}>
            <TextInput placeholder="website-name" defaultValue={data.website} style={styles.text} label="website-name" onChangeText={(text)=>{setWebsite(text)}}/>
            <TextInput placeholder="username" defaultValue={data.username} style={styles.text} label="username"onChangeText={(text)=>{setUsername(text)}}/>
            <TextInput placeholder="password" defaultValue={data.password} style={styles.text} label="password" onChangeText={(text)=>{setPassword(text)}}/>
          </View>
          <View>
            <Button style={{marginBottom:10}} mode="contained" onPress={updateChanges}>Update</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ModalTester;

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: "white",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 400,
    paddingBottom: 20,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
  },
  text: {
    color: "#bbb",
    fontSize: 20,
    marginVertical: 10,
    backgroundColor: "transparent",
  },
  btnContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 500,
  },
});