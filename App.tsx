import React, { useState } from 'react';
import { 
  KeyboardAvoidingView, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Keyboard, 
  ScrollView, 
  Platform, 
  Alert 
} from 'react-native';
import Task from './components/task';

export default function App() {
  const [task, setTask] = useState<string | null>(null);
  const [taskItems, setTaskItems] = useState<string[]>([]);

  const forbiddenWords = ["palavrão", "ofensivo", "proibido"]; // Adapte conforme necessário

  const validateTask = (task: string): string | null => {
    const trimmedTask = task.trim();

    if (!trimmedTask) return "A tarefa não pode estar vazia!";
    if (trimmedTask.length < 5) return "A tarefa deve ter pelo menos 5 caracteres!";
    if (trimmedTask.length > 100) return "A tarefa não pode ter mais de 100 caracteres!";
    if (/^\d+$/.test(trimmedTask)) return "A tarefa não pode conter apenas números!";
    if (taskItems.includes(trimmedTask)) return "Essa tarefa já foi adicionada!";
    if (/[@#\$%\^&\*\(\)_\+\=\[\]{};':"\\|,.<>\/?]+/.test(trimmedTask)) return "A tarefa contém caracteres inválidos!";
    if (/^(.)\1{4,}$/.test(trimmedTask)) return "A tarefa não pode ter caracteres repetidos em excesso!";
    if (!/^[A-ZÀ-Ÿ]/.test(trimmedTask)) return "A primeira letra da tarefa deve ser maiúscula!";
    if (forbiddenWords.some(word => trimmedTask.toLowerCase().includes(word))) return "A tarefa contém palavras proibidas!";

    return null;
  };

  const handleAddTask = () => {
    if (task) {
      const validationError = validateTask(task);
      if (validationError) {
        Alert.alert("Erro", validationError);
        return;
      }
      
      Keyboard.dismiss();
      setTaskItems([...taskItems, task.trim()]); // Remove espaços extras
      setTask(null);
    }
  };

  const completeTask = (index: number) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>
          <View style={styles.items}>
            {taskItems.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={item} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Write a task'}
          value={task || ''}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#55BCF6',
  },
});

