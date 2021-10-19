<template>
  <hello-world />
</template>

<script>
  import HelloWorld from '../components/HelloWorld'

  export default {
    name: 'Home',

    components: {
      HelloWorld,
    },
  }
</script>
<style>
a{
  text-decoration: none;
}

.router-link-active{
  text-decoration: none;
}
</style>