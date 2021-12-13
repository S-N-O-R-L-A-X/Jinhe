<template>
  <v-card color="amber lighten-2" dark>
    <v-snackbar v-model="snackbar" top color="warning" timeout="2000">{{message}}</v-snackbar>
    <v-card-title class="text-h5 amber lighten-3">站台查询</v-card-title>

    <v-row>
      <v-col cols="6">
    <v-card-text>
      <v-text-field v-model="platform" placeholder="请输入站台名" label="请输入站台名"></v-text-field>
    </v-card-text>

    <v-divider></v-divider>
    
    <v-card-actions>
      <v-btn color="amber darken-3" @click="getAllLines()">
        查询经过该站的所有路线
        <v-icon right>
          mdi-magnify
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
      isLoading: false,
      returned:0,
      platform:null,
      platforms:[],
      headers:[],
      lines:[],
      snackbar:false,
      message:null,
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
                console.log(response);
                if(response.data.length===0){
                  that.snackbar=true;
                  that.message="找不到该站台！";
                }
                else{
                  that.returned=1;
                  that.headers=[{text:"id",value:"id"},{text:"经过的路线名",value:"alongLine"}]
                }
            })
            .catch(error => {
                alert('获取线路失败!\n' + error.message);
            })
            .finally(() => {
                this.loading = false;
                
                // console.log(this.platforms);
            });
        },
        
        clearAll(){
          this.line_id = null;
          this.returned=0;
        }
    }
}
</script>

<style>

</style>