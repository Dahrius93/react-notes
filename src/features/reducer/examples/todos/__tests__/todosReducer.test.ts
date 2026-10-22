import { describe, expect, it } from 'vitest'
import { selectStats, selectVisibleTodos, todosReducer, type TodosState } from '../todosReducer'

// No React, no DOM: a reducer is tested like any pure function
const state: TodosState = {
  todos: [
    { id: 'a', text: 'Primo', done: false },
    { id: 'b', text: 'Secondo', done: true },
  ],
  filter: 'all',
}

describe('todosReducer', () => {
  it('adds a todo at the end, not done', () => {
    const next = todosReducer(state, { type: 'added', id: 'c', text: 'Terzo' })
    expect(next.todos.at(-1)).toEqual({ id: 'c', text: 'Terzo', done: false })
  })

  it('toggles only the matching todo', () => {
    const next = todosReducer(state, { type: 'toggled', id: 'a' })
    expect(next.todos.map((t) => t.done)).toEqual([true, true])
    // Unchanged items keep their identity (useful for memo)
    expect(next.todos[1]).toBe(state.todos[1])
  })

  it('edits and deletes', () => {
    const edited = todosReducer(state, { type: 'edited', id: 'a', text: 'Modificato' })
    expect(edited.todos[0].text).toBe('Modificato')

    const deleted = todosReducer(edited, { type: 'deleted', id: 'a' })
    expect(deleted.todos.map((t) => t.id)).toEqual(['b'])
  })

  it('clears completed todos and toggles all', () => {
    expect(todosReducer(state, { type: 'completedCleared' }).todos.map((t) => t.id)).toEqual(['a'])
    expect(todosReducer(state, { type: 'allToggled', done: true }).todos.every((t) => t.done)).toBe(true)
  })

  it('never mutates the previous state', () => {
    const snapshot = structuredClone(state)
    todosReducer(state, { type: 'toggled', id: 'a' })
    todosReducer(state, { type: 'deleted', id: 'b' })
    expect(state).toEqual(snapshot)
  })

  it('returns the same object when the filter does not change', () => {
    expect(todosReducer(state, { type: 'filterChanged', filter: 'all' })).toBe(state)
  })
})

describe('selectors', () => {
  it('filters the visible todos', () => {
    expect(selectVisibleTodos({ ...state, filter: 'active' }).map((t) => t.id)).toEqual(['a'])
    expect(selectVisibleTodos({ ...state, filter: 'completed' }).map((t) => t.id)).toEqual(['b'])
  })

  it('computes the stats', () => {
    expect(selectStats(state)).toEqual({ total: 2, completed: 1, active: 1 })
  })
})
