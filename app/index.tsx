import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToDoItem } from './components/Todo'

export interface ToDoTask {
  id: number
  title: string
  isDone: boolean
}

export const Index = () => {
  const [todos, setTodos] = useState<ToDoTask[]>([])
  const [todoText, setTodoText] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [oldTodos, setOldTodos] = useState<ToDoTask[]>([])

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem('my-todo')
        if (todos !== null) {
          setTodos(JSON.parse(todos))
          setOldTodos(JSON.parse(todos))
        }
      } catch (error) {
        console.log(error)
      }
    }
    getTodos()
  }, [])

  const addTodo = async () => {
    try {
      const newTodo = {
        id: Math.random(),
        title: todoText,
        isDone: false,
      }
      todos.push(newTodo)
      setTodos(todos)
      setOldTodos(todos)
      await AsyncStorage.setItem('my-todo', JSON.stringify(todos))
      setTodoText('')
      Keyboard.dismiss()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const newTodos = todos.filter((todo) => todo.id !== id)
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos))
      setTodos(newTodos)
      setOldTodos(newTodos)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDone = async (id: number) => {
    try {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone
        }
        return todo
      })
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos))
      setTodos(newTodos)
      setOldTodos(newTodos)
    } catch (error) {
      console.log(error)
    }
  }

  const onSearch = (query: string) => {
    if (query == '') {
      setTodos(oldTodos)
    } else {
      const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(query.toLowerCase())
      )
      setTodos(filteredTodos)
    }
  }

  useEffect(() => {
    onSearch(searchQuery)
  }, [searchQuery])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            alert('Clicked!')
          }}
        >
          <Ionicons name="menu" size={24} color={'#333'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={{ uri: 'https://xsgames.co/randomusers/avatar.php?g=male' }}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color={'#333'} />
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
          clearButtonMode="always"
        />
      </View>

      <FlatList
        data={[...todos].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ToDoItem
            todo={item}
            deleteTodo={deleteTodo}
            handleDone={handleDone}
          />
        )}
      />

      <KeyboardAvoidingView
        style={styles.footer}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <TextInput
          placeholder="Add New ToDo"
          value={todoText}
          onChangeText={(text) => setTodoText(text)}
          style={styles.newTodoInput}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addTodo()}>
          <Ionicons name="add" size={34} color={'#fff'} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 8,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: 20,
  },
  newTodoInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4630EB',
    padding: 8,
    borderRadius: 10,
    marginLeft: 20,
  },
})
