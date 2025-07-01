'use client'

import { useState, useEffect } from 'react'
import { Todo, FilterType } from '@/types/todo'

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'created' | 'completed'>('created')

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined
      }))
      setTodos(parsedTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim() === '') return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date()
    }

    setTodos([...todos, newTodo])
    setInputValue('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const newCompleted = !todo.completed
        return {
          ...todo,
          completed: newCompleted,
          completedAt: newCompleted ? new Date() : undefined
        }
      }
      return todo
    }))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
    setDeleteConfirmId(null)
  }

  const confirmDelete = (id: string) => {
    if (!editingId) {
      setDeleteConfirmId(id)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  const startEdit = (id: string, text: string) => {
    const todo = todos.find(t => t.id === id)
    if (todo && !todo.completed) {
      setEditingId(id)
      setEditingText(text)
      setDeleteConfirmId(null)
    }
  }

  const saveEdit = (id: string) => {
    if (editingText.trim() === '') {
      cancelEdit()
      return
    }

    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText.trim() } : todo
    ))
    setEditingId(null)
    setEditingText('')
    setDeleteConfirmId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
    setDeleteConfirmId(null)
  }

  const handleEditKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      saveEdit(id)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const filteredTodos = todos
    .filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed
        case 'completed':
          return todo.completed
        default:
          return true
      }
    })
    .sort((a, b) => {
      if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        // 完了時刻でソート（完了済みのみ、未完了は作成時刻）
        const aTime = a.completedAt ? a.completedAt.getTime() : a.createdAt.getTime()
        const bTime = b.completedAt ? b.completedAt.getTime() : b.createdAt.getTime()
        return bTime - aTime
      }
    })

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      addTodo()
    }
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length
  const completedTodosCount = todos.filter(todo => todo.completed).length

  return (
    <div className="container">
      <div className="todo-app">
        <div className="todo-header">
          <h1>📝 ToDo リスト</h1>
          <p>タスクを管理して生産性を向上させましょう</p>
        </div>

        <div className="todo-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="新しいタスクを入力してください..."
            maxLength={100}
          />
          <button
            onClick={addTodo}
            disabled={inputValue.trim() === ''}
          >
            追加
          </button>
        </div>

        <div className="todo-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全て ({todos.length})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            未完了 ({activeTodosCount})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            完了済み ({completedTodosCount})
          </button>
        </div>

        <div className="todo-sort">
          <button
            className={`sort-btn ${sortBy === 'created' ? 'active' : ''}`}
            onClick={() => setSortBy('created')}
          >
            作成順
          </button>
          <button
            className={`sort-btn ${sortBy === 'completed' ? 'active' : ''}`}
            onClick={() => setSortBy('completed')}
          >
            完了順
          </button>
        </div>

        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <h3>
              {filter === 'all' ? 'タスクがありません' :
               filter === 'active' ? '未完了のタスクがありません' :
               '完了済みのタスクがありません'}
            </h3>
            <p>
              {filter === 'all' ? '新しいタスクを追加してみましょう！' :
               filter === 'active' ? '全てのタスクが完了しています！' :
               'まだ完了したタスクがありません'}
            </p>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                {editingId === todo.id ? (
                  <input
                    type="text"
                    className="todo-edit-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                    onBlur={(e) => {
                      // ボタンクリック以外でのフォーカス離脱時のみ保存
                      if (!e.relatedTarget || 
                          (!e.relatedTarget.classList.contains('todo-save') && 
                           !e.relatedTarget.classList.contains('todo-cancel'))) {
                        setTimeout(() => saveEdit(todo.id), 100)
                      }
                    }}
                    maxLength={100}
                    autoFocus
                  />
                ) : (
                  <div className="todo-content">
                    <span
                      className={`todo-text ${todo.completed ? 'completed' : ''}`}
                      onDoubleClick={() => startEdit(todo.id, todo.text)}
                      onClick={() => startEdit(todo.id, todo.text)}
                    >
                      {todo.text}
                    </span>
                    {todo.completed && todo.completedAt && (
                      <div className="todo-timestamp">
                        完了: {todo.completedAt.toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                )}
                <div className="todo-actions">
                  {editingId === todo.id ? (
                    <>
                      <button
                        className="todo-save"
                        onClick={() => saveEdit(todo.id)}
                      >
                        保存
                      </button>
                      <button
                        className="todo-cancel"
                        onClick={cancelEdit}
                      >
                        取消
                      </button>
                    </>
                  ) : (
                    <>
                      {!todo.completed && (
                        <button
                          className="todo-edit"
                          onClick={() => startEdit(todo.id, todo.text)}
                        >
                          編集
                        </button>
                      )}
                      <button
                        className="todo-delete"
                        onClick={() => confirmDelete(todo.id)}
                      >
                        削除
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <div className="todo-stats">
            <p>
              合計: {todos.length}件 | 未完了: {activeTodosCount}件 | 完了済み: {completedTodosCount}件
            </p>
          </div>
        )}
      </div>

      {/* 削除確認モーダル */}
      {deleteConfirmId && !editingId && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>削除確認</h3>
            <p>このタスクを削除してもよろしいですか？</p>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={cancelDelete}
              >
                キャンセル
              </button>
              <button
                className="modal-delete"
                onClick={() => deleteTodo(deleteConfirmId)}
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoApp