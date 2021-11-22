<template>
  <v-card
    color="amber lighten-2"
    dark
  >
    <v-card-title class="text-h5 amber lighten-3">站台查询</v-card-title>
    
    <v-row>
      <v-col cols="6">
    <v-card-text>
      <v-text-field v-model="platform" placeholder="请输入站台名" label="请输入站台名"></v-text-field>
      <v-text-field v-model="platform" placeholder="请输入站台名" label="请输入站台名"></v-text-field>

    </v-card-text>

    
    <v-divider></v-divider>
    
    <v-card-actions>
      <v-btn color="amber darken-3" @click="getAllLines()">
        查询经过该站的所有路线
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
      
      <v-btn :disabled="!platform" color="grey darken-3" @click="clearAll()">
        Clear
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
    </v-card-actions>
    </v-col>
    <v-col cols="6">
        <v-expand-transition offset--x>
          <div v-show="returned===1">
            <v-data-table :headers="headers" :items="lines" :items-per-page="15" class="elevation-1">
            </v-data-table>

          </div>
        </v-expand-transition>
      </v-col>
    </v-row>
    
  </v-card>

</template>

<script>
import axios from "axios"
export default {
    data: () => ({
      descriptionLimit: 30,
      isLoading: false,
      search: null,
      returned:0,
      length: 3,
      window: 0,
      directional:null,
      platform:null,
      platforms:[],
      headers:[],
      lines:[],
    }),
    methods: {
        getAllLines(){
            this.loading = true;
            let that = this;
            axios.get('http://localhost:8081/nosql/LineController/listAlongLine?',  {
            params: {
              name:this.platform
              
            }
            })
            .then(response => {
                that.lines=response.data;
            })
            .catch(error => {
                alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
            })
            .finally(() => {
                this.loading = false;
                this.returned=1;
                this.headers=[{text:"id",value:"id"},{text:"经过的路线名",value:"alongLine"}]
                // console.log(this.platforms);
            });
        },
        
        clearAll(){
          this.line_id = null;
          this.returned=0;
          this.directional=null;
        }
    }
}
</script>

<style>

</style>