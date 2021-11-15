<template>
  <v-app>
    <v-app-bar app color="amber" dark>
      <div class="d-flex align-center">
        金河市公交系统
      </div>

      <v-spacer></v-spacer>
      <router-link to="/"><v-icon>mdi-car-info</v-icon>首页</router-link>
      <v-spacer></v-spacer>
      <router-link to="/info"><v-icon>mdi-car-info</v-icon>基本信息查询</router-link>
      <v-spacer></v-spacer>
      <router-link to="/platform"><v-icon>mdi-bus-marker</v-icon>站台查询</router-link>
      <v-spacer></v-spacer>
      <router-link to="/statistics"><v-icon>mdi-bus-stop</v-icon>统计数据</router-link>
      <v-spacer></v-spacer>
      <router-link to="/analysis"><v-icon>mdi-bus-multiple</v-icon>分析查询</router-link>
      <v-spacer></v-spacer>
      <router-link to="/route"><v-icon>mdi-subway</v-icon>线路管理</router-link>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style scoped>

</style>