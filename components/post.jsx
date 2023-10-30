import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Image, Text, View } from 'react-native';
import themeContext from './themeContext';
 
export const Post = ({title, imageUrl, recipe, CPFCP}) => 
{
  const theme = useContext(themeContext);
    return  (
    <View style={styles.PostView} >
        <Image style={styles.PostImage} source={{ uri: imageUrl}}/>
        <View style= {styles.PostDetails}> 
            <Text style= {[styles.PostTitle, {color: theme.textColor}]}> {title} </Text>
            <Text style= {[styles.PostData , {color: theme.textColor}]}> {recipe.slice(0, 30)}... </Text>
            <View style={{flexDirection: "row"}}>
              {CPFCP.map((item, index) => (
                <View style={{flexDirection: "row", marginEnd: 5}} key= {index} >
                  <Text style= {[styles.PostCPFCPTitle, {color: theme.textColor}]}> {'КБЖУ₽'[index]}:</Text>
                  <Text style= {[styles.PostCPFCPText, {color: theme.textColor}]}> {item}</Text>
                </View>
              ))}
            </View>
        </View>
  </View>)
}

const styles = StyleSheet.create({
  PostView: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  PostImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12
  },
  PostTitle: {
    fontSize: 20,
    marginRight: 65,
    fontFamily: 'stolzl'
  },
  PostDetails: {
    flexDirection: 'column',
    justifyContent: "space-between",
    marginVertical: 1
  },
  PostData: {
    fontSize: 14,
    fontFamily: 'stolzl_light'
  },
  PostCPFCPText: {
    fontSize: 15,
    fontFamily: 'stolzl_light'
  },
  PostCPFCPTitle: {
    fontSize: 15,
    fontFamily: 'stolzl'
  }
})
