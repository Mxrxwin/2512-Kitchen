import { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
} from "react-native";
import { FIREBASE_AUTH } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import themeContext from "../components/themeContext";

export default function PersonalInfoPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const [hidePass, setHidePass] = useState(false);
  const theme = useContext(themeContext);

  const signIn = async () => {
    setLoading(true);
    try {
      const responce = await signInWithEmailAndPassword(auth, email, password);
      console.log(responce);
    } catch (err) {
      console.log(err);
      alert("Sign in failed " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const responce = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(responce);
      alert("Check email.");
    } catch (err) {
      console.log(err);
      alert("Sign up failed " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaView style={{flex:1}}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginrTop: 25 }}
        >
          <TouchableOpacity
            style={{ alignItems: "flex-start", margin: 16 }}
            onPress={navigation.openDrawer}
          >
            <Octicons name="three-bars" size={28} color={theme.textColor} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center', marginBottom: 100}} >
          <TextInput
            style={[styles.input, {backgroundColor: theme.searchColor, color: theme.textColor}]}
            placeholder="Email"
            autoCapitalize="none"
            placeholderTextColor={theme.searchPlaceholderColor}
            onChangeText={(text) => setEmail(text)}
          ></TextInput>
          <View style={[styles.input, {backgroundColor: theme.searchColor}]}>
            <TextInput
              style={{ fontFamily: 'stolzl', width: "90%", color: theme.textColor }}
              secureTextEntry={!hidePass}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor= {theme.searchPlaceholderColor}
            ></TextInput>
            <Ionicons
              name={hidePass ? "eye" : "eye-off"}
              size={24}
              color="#aaa"
              style={{ marginHorizontal: 10 }}
              onPress={() => setHidePass(!hidePass)}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={{ marginTop: 30 }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#83E144" }]}
                onPress={signIn}
              >
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                title="Register"
                onPress={signUp}
              >
                <Text style={[styles.buttonText, { color: "#83E144" }]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    marginHorizontal: 20,
    height: 45,
    borderWidth: 1,
    borderColor: '#3333',
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    fontWeight: "400",
    flexDirection: "row",
    fontFamily: 'stolzl'
  },
  button: {
    borderRadius: 10,
    height: 50,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 60,
    borderWidth: 2,
    borderColor: "#83E144",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
  },
});
