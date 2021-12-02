<template>
  <v-card color="amber lighten-2" dark>
    <v-card-title class="text-h5 amber lighten-3">
      查询路线
    </v-card-title>
    <v-row>
      <v-col cols="6">
        <v-card-text>
            <v-text-field v-model="line1" placeholder="请输入线路1" label="请输入线路1"></v-text-field>
            <v-text-field v-model="line2" placeholder="请输入线路2" label="请输入线路2"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-btn color="amber darken-3" :disabled="!line1||!line2" @click="getDuplicatePlatforms()">
            查询两条线路重复的站点名
            <v-icon right>
            mdi-close-circle
            </v-icon>
        </v-btn>

        <v-btn color="amber darken-3" :disabled="!line1||line2" @click="getExchangeRoutes()">
            查询线路换乘情况
            <v-icon right>
            mdi-close-circle
            </v-icon>
        </v-btn>

        <v-btn :disabled="!line1&&!line2" color="grey darken-3" @click="clearAll()">
            Clear
            <v-icon right>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-expand-transition offset--x>
          <div v-show="returned===1">
              <p>共{{platforms.count}}个重复站点名</p>
              <v-list v-for="platform of platforms.crossStation" dense>
                  <v-list-item>{{platform.name}} {{platform.english}}</v-list-item>
              </v-list>
          </div>
        </v-expand-transition>

        <v-expand-transition offset--x>
          <div v-show="returned===2">
              <v-data-table :headers="headers" :items="platforms">
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
        line1:null,
        line2:null,
        platforms:[],
        returned:0,
    }),
    methods:{
        getDuplicatePlatforms(){
          this.loading = true;
          let that = this;
          
          axios.get('http://localhost:8081/nosql/StationController/listCrossStation',  {
          params: {
            line1:this.line1,
            line2:this.line2,
          }
          })
          .then(response => {
              that.platforms=response.data;
          })
          .catch(error => {
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
          })
          .finally(() => {
              console.log(this.platforms);
              this.headers=[{text:'上一站',value:'fromStation'},{text:'下一站',value:'toStation'},{text:'线路数量',value:'lineCount'}];
              
              this.loading = false;
              this.returned=1;
              
          });
        },
        getExchangeRoutes(){
          this.loading = true;
          let that = this;
          console.log(this.line1);
          axios.get('http://localhost:8081/nosql/LineController/listTransLineStation',  {
          params: {
            lineName:this.line1,
            
          }
          })
          .then(response => {
              that.platforms=response.data;
          })
          .catch(error => {
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
          })
          .finally(() => {
              console.log(this.platforms);
              this.headers=[{text:'站台名',value:'name'},{text:'经过该站台的路线',value:'type'}];
              this.loading = false;
              this.returned=2;
          });
        },
        clearAll(){
          this.line1=null;
          this.line2=null;
        }
    }
}
</script>

<style>

</style>