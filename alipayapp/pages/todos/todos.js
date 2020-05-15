const AV = require('leancloud-storage/live-query')

// set by onLoad after login
const todoACL = new AV.ACL()
const Todo = AV.Object.extend('Todo')
// set by onLoad after login
const liveHandler = {}
Page({
  data: {
    draft: '',
    activeCount: 0,
    todos: [],
    editingTodoId: '',
  },
  async onLoad() {
    // use test user until backend implement alipay mini-app login feature
    let user = await AV.User.logIn('test', 'test')
    todoACL.setPublicReadAccess(false)
    todoACL.setPublicWriteAccess(false)
    todoACL.setReadAccess(user, true)
    todoACL.setWriteAccess(user, true)

    Object.assign(liveHandler, {
      update: this.liveUpdateTodo.bind(this),
      enter: this.liveAddTodo.bind(this),
      create: this.liveAddTodo.bind(this),
      leave: this.liveRemoveTodo.bind(this),
      delete: this.liveRemoveTodo.bind(this),
    })

    this.fetchTodo()
  },
  onPullDownRefresh() {
    this.fetchTodo().finally(my.stopPullDownRefresh)
  },

  async fetchTodo() {
    if (this.liveQuery) {
      Object.entries(liveHandler).forEach(([e, h]) => this.liveQuery.off(e, h))
      await this.liveQuery.unsubscribe()
    }

    let query = new AV.Query(Todo)
      .equalTo('user', AV.User.current())
      .ascending('createdAt')
    let todos = await query.find()
    todos = todos.map(todo => ({
      objectId: todo.id,
      content: todo.get('content'),
      done: todo.get('done'),
    }))
    this.clearTodo()
    this.addTodo(todos)

    this.liveQuery = await query.subscribe()
    Object.entries(liveHandler).forEach(([e, h]) => this.liveQuery.on(e, h))
  },
  addTodo(todo) {
    let arr = [0, 0] // insert into index 0 and delete 0 todo
    let activeCount = 0
    if (todo instanceof Array) {
      arr = arr.concat(todo.reverse())
      todo.forEach(todo => activeCount += todo.done ? 0 : 1)
    } else {
      arr.push(todo)
      activeCount += todo.done ? 0 : 1
    }
    this.$spliceData({ todos: arr })
    this.setData({ activeCount })
  },
  removeTodo(objectId) {
    let delIdx = -1
    for (let i = 0; i < this.data.todos.length; ++i) {
      if (this.data.todos[i].objectId === objectId) {
        delIdx = i
        break
      }
    }
    if (delIdx === -1) return
    this.$spliceData({ todos: [delIdx, 1]})
  },
  clearTodo() {
    this.setData({ todos: [], activeCount: 0 })
  },
  clearDraft() {
    this.setData({ draft: '' })
  },
  updateTodo(objectId, attr) {
    let index = -1
    for (let i = 0; i < this.data.todos.length; ++i) {
      if (this.data.todos[i].objectId === objectId) {
        index = i
        break
      }
    }
    if (index === -1) return

    let todo = this.data.todos[index]
    if (todo.done && attr.done === false) {
      this.setData({ activeCount: this.data.activeCount + 1 })
    } else if (!todo.done && attr.done === true) {
      this.setData({ activeCount: this.data.activeCount - 1 })
    }

    Object.assign(todo, attr)
    this.$spliceData({ todos: [index, 1, todo] })
  },

  handleChangeDraft(e) {
    let val = e.detail.value
    if (val === this.data.draft) return
    this.setData({ draft: val })
  },
  handleChangeDone(e) {
    const done = e.detail.value
    const id = e.target.dataset.id
    this.updateTodo(id, { done })

    let todo = AV.Object.createWithoutData('Todo', id)
    todo.set('done', done)
    todo.save()
  },
  async handleAddTodo(e) {
    let todo = new Todo()
    todo.set('content', this.data.draft)
    todo.set('user', AV.User.current())
    todo.set('done', false)
    todo.setACL(todoACL)
    todo = await todo.save()

    this.addTodo({
      objectId: todo.get('objectId'),
      content: this.data.draft,
      done: false
    })

    this.clearDraft()
  },
  handleEditTodo(e) {
    this.setData({ editingTodoId: e.target.dataset.id })
  },
  handleFinishEdit(e) {
    const id = e.target.dataset.id
    const content = e.detail.value
    this.setData({ editingTodoId: '' })
    this.updateTodo(id, { content })

    let todo = AV.Object.createWithoutData('Todo', id)
    todo.set('content', content)
    todo.save()
  },
  handleRemoveDone() {
    let toDel = this.data.todos
      .filter(todo => todo.done)
      .map(todo => AV.Object.createWithoutData('Todo', todo.objectId))
    AV.Object.destroyAll(toDel)

    const todos = this.data.todos.filter(todo => !todo.done)
    this.setData({ todos })
  },

  liveAddTodo(todo) {
    this.addTodo({
      objectId: todo.id,
      content: todo.get('content'),
      done: todo.get('done')
    })
  },
  liveUpdateTodo(todo) {
    this.updateTodo(todo.id, {
      content: todo.get('content'),
      done: todo.get('done')
    })
  },
  liveRemoveTodo(todo) {
    this.removeTodo(todo.id)
  }
});
