import React from "react"
import { View, ActivityIndicator, Text} from "react-native";

export const Loading = () => {

    return(
    <View 
        style={{
            flex: 1,
            justifyContent :'center',
            alignItems: 'center'
        }}>
        <ActivityIndicator size="large"/>
        <Text style={{ marginTop:15, fontWeight: 300, fontFamily: "slolzl"}}>Загрузка</Text>
    </View>
    )
}