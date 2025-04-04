import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Checkbox } from 'expo-checkbox'
import { Ionicons } from '@expo/vector-icons'
import type { ToDoTask } from '../index'

interface ToDoItemProps {
  todo: ToDoTask
  deleteTodo: (id: number) => void
  handleDone: (id: number) => void
}

export const ToDoItem = ({ todo, deleteTodo, handleDone }: ToDoItemProps) => (
  <View style={styles.todoContainer}>
    <View style={styles.todoInfoContainer}>
      <Checkbox
        value={todo.isDone}
        onValueChange={() => handleDone(todo.id)}
        color={todo.isDone ? '#4630EB' : undefined}
      />
      <Text
        style={[
          styles.todoText,
          todo.isDone && { textDecorationLine: 'line-through' },
        ]}
      >
        {todo.title}
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => {
        deleteTodo(todo.id)
        alert('Deleted ' + todo.id)
      }}
    >
      <Ionicons name="trash" size={24} color={'red'} />
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  todoInfoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
})
