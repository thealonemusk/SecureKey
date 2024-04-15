import React, { useEffect } from "react";
import { View,StyleSheet , ScrollView , Dimensions, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Modal, Portal, Searchbar } from "react-native-paper";
import MyCard from "../components/card.js";
import MyModal from "../components/modal.js";
import MyAppBar from "../components/appbar.js";
import { useRoute } from "@react-navigation/native";


const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

class Data {
    constructor(website,username,password){
        this.website = website || '';
        this.username = username || '';
        this.password = password || '';
    }
}

function Home({navigation}) {
    useEffect(()=>{
        getData(uid);
    },[]);

    const route = useRoute();
    const uid = route.params.uid;
    const user_name = route.params.user_name;

    const [loading, setLoading] = React.useState(true);

    const [modalVisible, setModalVisible] = React.useState(false);

    const [searchQuery, setSearchQuery] = React.useState('');

    const [displData, setDisplData] = React.useState([]);
    
    const filterData = displData.filter((item)=>item.website?.toLowerCase().includes(searchQuery.toLowerCase()));



    const getData = async (uid) => {
        try {
            const data = [];
            const response = await fetch(`https://key-api-production.up.railway.app/users/${uid}`);
            const json = await response.json();
            for(let i = 0;i<json.website.length;i++){
                const newData = new Data(json.website[i],json.username[i],json.password[i]);
                data.push(newData);
            }
            setDisplData(data);
        }
        catch (error) {
            console.log(error);
        }
        finally{
            console.log("finally");
            setLoading(false);
        }
    }

    const handleAdd = () => {
        setModalVisible(true);
    }



    const deleteData = async (index) => {
        console.log(index);
        const newData = displData.filter((item,i)=>i!==index);
        loading?null:setLoading(true);
        try{
            await fetch(`https://key-api-production.up.railway.app/users/${uid}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid : uid,
                    website : newData.map((item)=>item.website),
                    username : newData.map((item)=>item.username),
                    password : newData.map((item)=>item.password),
                })
            })
        }catch(error){
            console.log(error);
        }
        finally{
            console.log("finally delete");
            setLoading(false);
        }
        setDisplData(newData);
    }

    const updateData = async (data,index) => {
        console.log(data,index);
        loading?null:setLoading(true);
        try{
            await fetch(`https://key-api-production.up.railway.app/users/${uid}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uid : uid,
                    website : displData.map((item,i)=>i===index?data.website:item.website),
                    username : displData.map((item,i)=>i===index?data.username:item.username),
                    password : displData.map((item,i)=>i===index?data.password:item.password),
                })
            })
        }
        catch(error){
            console.log(error);
        }
        finally{
            console.log("finally update");
            setLoading(false);
        }
    }

    const addData = async (website,username,password) => {
        console.log(website,username,password);
        if(website.length<1 || username.length<1 || password.length<1){
            
        }
        else{
            loading?null:setLoading(true);
            try{
                await fetch(`https://key-api-production.up.railway.app/users/${uid}`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uid : uid,
                        website : displData.map((item)=>item.website).concat(website),
                        username : displData.map((item)=>item.username).concat(username),
                        password : displData.map((item)=>item.password).concat(password),
                    })
                })
                await getData(uid);
            }
            catch(error){
                console.log(error);
            }
            finally{
                console.log("finally add");
                setLoading(false);
                setModalVisible(false);
            }
        }
    }


    return (
        <SafeAreaView style={style.homepage}>
            {loading?<Portal><Modal visible={loading} style={style.loading}><ActivityIndicator /></Modal></Portal>:null}
            <MyAppBar user_name={user_name} navigation={navigation} handleAdd={handleAdd}/>
            <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:height*0.08}}>
                <View style={style.searchbar} >
                    <Searchbar placeholder="website name" searchQuery={searchQuery} onChangeText={setSearchQuery}/>
                </View>
                {
                    filterData.map((item,index)=>{
                        return (
                            <MyCard key={index} data={item} index={index} deleteData={deleteData} updateData={updateData}/>
                        )
                   })
                }
            </ScrollView>
            {modalVisible && <Portal><MyModal visible={modalVisible} setVisible={setModalVisible} addData={addData} /></Portal>}
        </SafeAreaView>
    )
}


const style = StyleSheet.create({
    homepage:{
        paddingHorizontal: width*0.02,
        marginBottom: height*0.02,
    },
    searchbar: {
        marginTop: height*0.02,
        marginBottom: height*0.01,
    },
    loading:{
        height: height,
        width: width,
        justifyContent: 'center',
        backgroundColor: 'white',
        opacity: 0.7,
    }
})



export default Home;