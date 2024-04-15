import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import ModalTester from './bottomSheet';
import MyFAB from './fab';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />


const MyCard = ({data , index , deleteData , updateData}) => {

  const [clicked , setClicked] = React.useState(false);

  const onPress = () => {
    console.log("delete clicked");
    deleteData(index);
    console.log(data);
  }

  openBottomSheet = () => {
    console.log("clicked");
    setClicked(true);
  }

  return(
      <Card style={styles.card}>
      <Card.Title title={data.website} subtitle={data.username} left={LeftContent} />
      <Card.Content>
        <Text variant="titleLarge">{data.password}</Text>
      </Card.Content>
      <Card.Actions style={styles.btn}>
        <Button mode='contained' onPress={openBottomSheet}>Update</Button>
      </Card.Actions>
      {clicked?<ModalTester isModalVisible={clicked} setModalVisible={setClicked} data={data} updateData={updateData} indexAt={index}/>:null}
      <MyFAB onPress={onPress}/>
    </Card>
  )
};

const styles = StyleSheet.create({
    card:{
        margin:10
    },
    btn:{
        marginEnd:5,
        marginBottom:10,
    }
})

export default MyCard;