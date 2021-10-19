<template>
  <v-app>
    <v-app-bar app color="amber" dark>
      <div class="d-flex align-center">
        金河市公交系统
      </div>

      <v-spacer></v-spacer>
      <router-link to="/info">基本信息查询</router-link>
      <v-spacer></v-spacer>
      <router-link to="/platform">站台查询</router-link>
      <v-spacer></v-spacer>
      <router-link to="/shift">班次查询</router-link>
      <v-spacer></v-spacer>
      <router-link to="/analysis">分析查询</router-link>
      <v-spacer></v-spacer>
      <router-link to="/route">线路查询</router-link>
    </v-app-bar>

    <v-main>
      <router-view/>
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
