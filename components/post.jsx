import { StyleSheet } from 'react-native';
import { Image, Text, View } from 'react-native';
 
export const Post = ({title, imageUrl, createdAt}) => 
{
    return  (
    <View style={styles.PostView} >
        <Image style={styles.PostImage} source={{ uri: imageUrl}}/>
        <View style= {styles.PostDetails}> 
            <Text style= {styles.PostTitle}> {title} </Text>
            <Text style= {styles.PostData}> {new Date(createdAt).toLocaleDateString()} </Text>
        </View>
  </View>)
}

const styles = StyleSheet.create({
  PostView: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1',
  },
  PostImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12
  },
  PostTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginRight: 65,
    fontFamily: 'stolzl',
  },
  PostDetails: {
    flexDirection: 'column'
  },
  PostData: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)'
  }
})
