import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);   // if we are in Work page -> true
  const [text, setText] = useState("");    // will be saving what user wrote in TextInput
  const [toDos, setToDos] = useState({});   // will be saving what user want to save as ToDo
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    loadToDos();
    console.log(toDos);
  }, []);

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async() => {
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if(s){
        setToDos(JSON.parse(s));
      }
    }
    catch(e){
      Alert.alert("ERROR", "Todo Function not loaded!");
      console.log(e);
    }
  };

  const addToDo = async() => {
    if(text === ""){
      return
    }
    const newToDos = {    // -> using ES6 sugar
      ...toDos, 
      [Date.now()] : { text, working, complete },
    }; 
    // const newToDos = Object.assign({}, toDos, { [Date.now()]: { text, work: working }, }); -> using Object.assign()

    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const completeToDo = (key) => {
    const newToDos = { ...toDos};
    Alert.alert(
      "Confirm", 
      "Are you done?", [
      { text: "Not yet..",
        onPress: () => {
          setComplete(false);
        } },
      {
        text: "YES!!!",
        onPress: () => {
          setComplete(true);
        },
      },
    ]);
    setToDos(newToDos);
    saveToDos(newToDos);
    return;
  };

  const editToDo = (key) => {
    return;
  };

  const deleteToDo = (key) => {
    Alert.alert(
      "Delete To Do?", 
      "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
    return;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
        <View style={styles.header}>
          <TouchableOpacity onPress={work}>
            <Text style={{...styles.btnText, color: working ? "white" : theme.listIcon}}>Work</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={travel}>
            <Text style={{...styles.btnText, color: !working ? "white" : theme.listIcon}}>Travel</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"} 
          style={styles.input}/>
        
        <ScrollView>
          {Object.keys(toDos).map(key => 
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <View style={styles.todoCheck}>
                  <TouchableOpacity onPress={() => completeToDo(key)}>
                    {toDos[key].complete === complete ? (
                      <MaterialCommunityIcons name="check-box-outline" size={20} color={theme.listIcon} />
                    ) : (
                      <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color={theme.listIcon} />
                    )}
                  </TouchableOpacity>
                  <Text style={{ ...styles.toDoText, marginHorizontal: 10 }}>{toDos[key].text}</Text>
                </View>
                <View style={styles.icons}>
                  <TouchableOpacity onPress={() => editToDo(key)}>
                    <Feather name="edit" size={20} color={theme.listIcon} style={{ marginHorizontal: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteToDo(key)}>
                    <Feather name="delete" size={20} color={theme.listIcon}/>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },

  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },

  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoCheck: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  toDoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

});
