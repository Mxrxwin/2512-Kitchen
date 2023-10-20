import React, {useContext} from "react"
import { View, ActivityIndicator, Text} from "react-native";
import themeContext from "./themeContext";


export const Loading = () => {
    const theme = useContext(themeContext);

    return(
    <View 
        style={{
            flex: 1,
            justifyContent :'center',
            alignItems: 'center',
            backgroundColor: theme.backgroundColor
        }}>
        <ActivityIndicator size="large"/>
        <Text style={{ marginTop:15, fontWeight: 300, color: theme.textColor}}>Загрузка</Text>
    </View>
    )
}