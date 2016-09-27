<template>
  <div class="hello">
    <ul>
      <li v-for="todo in todos">{{todo.text}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      todos: [
        { text: '123' },
        { text: '123' },
        { text: '123' }
      ]
    }
  }
}
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
