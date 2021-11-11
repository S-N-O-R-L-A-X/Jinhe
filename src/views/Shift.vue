<template>
  <v-card
    color="amber lighten-2"
    dark
  >
    <v-card-title class="text-h5 amber lighten-3">
      查询线路信息
    </v-card-title>
    
    <v-card-text>
      <v-autocomplete v-model="line_id" :loading="isLoading"  color="white"
        label="请在此输入线路名" placeholder="输入线路名" prepend-icon="mdi-database-search" return-object>
      </v-autocomplete>
    </v-card-text>
    <v-card-text>
        <v-text-field v-model="search"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn color="amber darken-3" @click="getBasicInfo()">
        Search
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="!line_id" color="grey darken-3" @click="line_id = null">
        Clear
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
    </v-card-actions>
</v-card>
  
</template>
<script>
  import axios from "axios"
  export default {
    data: () => ({
      descriptionLimit: 30,
      entries: [],
      isLoading: false,
      line_id: null,
      search: null,
      returned:0,
      length: 3,
      window: 0,
      basicInfo:{},
    }),
    methods:{
      getBasicInfo(){
        console.log(this.line_id);
      }
    },
    
  }
</script>