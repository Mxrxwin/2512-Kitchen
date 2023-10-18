import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Image, Text, View } from 'react-native';
import themeContext from './themeContext';
 
export const Post = ({title, imageUrl, createdAt}) => 
{
  const theme = useContext(themeContext);
    return  (
    <View style={styles.PostView} >
        <Image style={styles.PostImage} source={{ uri: imageUrl}}/>
        <View style= {styles.PostDetails}> 
            <Text style= {[styles.PostTitle, {color: theme.textColor}]}> {title} </Text>
            <Text style= {[styles.PostData , {color: theme.textColor}]}> {new Date(createdAt).toLocaleDateString()} </Text>
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
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12
  },
  PostTitle: {
    fontSize: 15,
    marginRight: 65,
    fontFamily: 'stolzl'
  },
  PostDetails: {
    flexDirection: 'column'
  },
  PostData: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
    fontFamily: 'stolzl'
  }
})
