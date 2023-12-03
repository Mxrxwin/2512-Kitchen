import { useContext } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Image, Text, View } from 'react-native';
import themeContext from './themeContext';
import { PixelRatio } from 'react-native';

export const Post = ({title, imageUrl, recipe, CPFCP}) => 
{
  const fontScale = PixelRatio.getFontScale();
  const windowWidth = useWindowDimensions().width;
  const theme = useContext(themeContext);
    return  (
    <View style={styles.PostView} >
        <Image style={styles.PostImage} source={{ uri: imageUrl}}/>
        <View style= {styles.PostDetails}> 
            <Text style= {[styles.PostTitle, {color: theme.textColor}]}> {title} </Text>
            <Text style= {[styles.PostData , {color: theme.textColor, width: windowWidth - 120 }]}
              numberOfLines={1}
            > {recipe}... 
            </Text>
            <View style={{flexDirection: "row", justifyContent: 'space-between', width: windowWidth - 120}}>
              {CPFCP.map((item, index) => (
                <View style={{flexDirection: "row"}} key={index} >
                  <Text style={{color: theme.textColor, fontSize: fontScale <= 1.1 ? 15 : 14 - (fontScale - 1) * 12, fontFamily: 'stolzl'}}>
                    {" "}{'КБЖУ₽'[index]}: <Text style={{fontFamily: 'stolzl_light'}}>{item} </Text>
                  </Text>
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
})
