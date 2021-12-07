<template>
<div>
  <v-navigation-drawer width="300" app clipped>
    <v-card height="100%" color="amber">
      <v-list>
        <v-list-item @click="getPlatformWithMostRoutes()">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>停靠路线最多的站点</v-list-item-content>
        </v-list-item>

        <v-list-item @click="getSpecialPlatforms()">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>统计特殊站台</v-list-item-content>
        </v-list-item>

        <v-list-item @click="getLineNumbers()">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>统计公交数量</v-list-item-content>
        </v-list-item>

        <v-list-item @click="getLinesWithMostPlatforms()">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>统计最多站点的线路</v-list-item-content>
        </v-list-item>

        <v-list-item @click="getLinesWithMostRunningTime()">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>统计运行时间最长的线路</v-list-item-content>
        </v-list-item>

        <v-list-item @click="getNeighbourPlatformsWithMostLines()">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>查询连接两个站台之间线路最多的两个站台</v-list-item-content>
        </v-list-item>
      </v-list>  
    </v-card>
  </v-navigation-drawer>

  <div>
    <v-card v-show="returned===1">
      <v-data-table :headers="headers" :items="platforms" :items-per-page="15" class="elevation-1">

      </v-data-table>
    </v-card>

    <v-card v-show="returned===2">
      <v-row>
        <v-col cols="4">
          地铁站
      
          <v-data-table :headers="headers1" :items="specialPlatforms.subwayName" :items-per-page="15" class="elevation-1">
          </v-data-table>
        </v-col>

        <v-col cols="4">
          起点站
          <v-data-table :headers="headers2" :items="specialPlatforms.initialName" :items-per-page="15" class="elevation-1">
          </v-data-table>
        </v-col>

        <v-col cols="4">
          终点站
          <v-data-table :headers="headers3" :items="specialPlatforms.endName" :items-per-page="15" class="elevation-1">
          </v-data-table>
        </v-col>

        <!-- <v-col cols="3">
          单行站
          <v-data-table :headers="headers4" :items="endName" :items-per-page="15" class="elevation-1">
          </v-data-table>
        </v-col> -->
      </v-row>
    </v-card>

    <v-card v-show="returned===3">
        <v-data-table :headers="headers" :items="lines" :items-per-page="15" class="elevation-1">
        </v-data-table>
    </v-card>

    <v-card v-show="returned===4">
        <v-data-table :headers="headers" :items="lines" :items-per-page="15" class="elevation-1">
        </v-data-table>
    </v-card>

    <v-card v-show="returned===5">
        <v-data-table :headers="headers" :items="lines" :items-per-page="15" class="elevation-1">
        </v-data-table>
    </v-card>

    <v-card v-show="returned===6">
        <v-data-table :headers="headers" :items="platforms" :items-per-page="15" class="elevation-1">
        </v-data-table>
    </v-card>
  </div>
</div>

</template>
  


<script>
  import axios from "axios"
  export default {
    data: () => ({
      descriptionLimit: 30,
      entries: [],
      isLoading: false,
      items: [],
      line_id: null,
      search: null,
      returned:0,
      length: 3,
      window: 0,
      basicInfo:{},
      directional:null,
      platforms:[],
      specialPlatforms:[],
      headers:[],
      items:[],
      initialName:[],
      endName:[],
      underground:[],
      lines:[],
      headers1:[],
      headers2:[],
      headers3:[],
      headers4:[],
      
    }),
    methods:{
      getPlatformWithMostRoutes(){
        let that=this;
        
        axios.get('http://localhost:8081/nosql/StationController/listNMostLine',  {
            params: {
              num:100
            }
          })
            .then(response => {
              that.platforms=response.data;
              console.log(that.platforms);
            })
            .catch(error => {
              alert('获取线路失败!\n' + error.message);
            })
            .finally(() => {
              this.returned=1;
              this.loading = false;
              this.headers=[{text:'站台名',value:'stationName'},{text:'经过线路数',value:'lineNum'},{text:"经过线路名",value:'lineName'}];
            });
      },
      
      getSpecialPlatforms(){
          this.loading = true;
          let that = this;
          axios.get('http://localhost:8081/nosql/StationController/listCaseStation',{
            params: {
              
            }
          })
          .then(response => {
              that.specialPlatforms=response.data;
              // console.log(this.platforms);
              this.returned=2;
          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              this.loading = false;
              
              this.headers1=[{text:"id",value:"id"},{text:"地铁站",value:"name"}];
              this.headers2=[{text:"id",value:"id"},{text:"起点站",value:"name"}];
              this.headers3=[{text:"id",value:"id"},{text:"终点站",value:"name"}];
              // this.headers4=[{text:"单行站",value:"endName"}];
              // this.endName=that.platforms.endName;
              
          });
      },

      getLineNumbers(){
          this.loading = true;
          let that = this;
          
          axios.get('http://localhost:8081/nosql/LineController/listLineTypeCount',  {
            params: {
              
            }
          })
          .then(response => {
              that.lines=response.data;
          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              this.headers=[{text:'类型',value:'type'},{text:'数量',value:'count'}];

              this.loading = false;
              this.returned=3;
              console.log(this.lines);
          });
      },

      getLinesWithMostPlatforms(){
          this.loading = true;
          let that = this;
          
          axios.get('http://localhost:8081/nosql/LineController/listNMostStationLine',  {
          params: {
            num:100
          }
          })
          .then(response => {
              that.lines=response.data;
          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              console.log(this.lines);
              this.headers=[{text:'类型',value:'type'},{text:'数量',value:'count'}];

              this.loading = false;
              this.returned=4;
              
          });
      },

      getLinesWithMostRunningTime(){
          this.loading = true;
          let that = this;
          
          axios.get('http://localhost:8081/nosql/LineController/listNMostTimeLine',  {
          params: {
            num:100
          }
          })
          .then(response => {
              that.lines=response.data;
          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              console.log(this.lines);
              this.headers=[{text:'类型',value:'type'},{text:'运行时间(单位：分钟)',value:'time'}];

              this.loading = false;
              this.returned=5;
              
          });
      },

      getNeighbourPlatformsWithMostLines(){
          this.loading = true;
          let that = this;
          
          axios.get('http://localhost:8081/nosql/StationController/listNMostLineStation',  {
          params: {
            num:100
          }
          })
          .then(response => {
              that.platforms=response.data;
          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              console.log(this.lines);
              this.headers=[{text:'上一站',value:'fromStation'},{text:'下一站',value:'toStation'},{text:'线路数量',value:'lineCount'}];

              this.loading = false;
              this.returned=6;
              
          });
      },
      

      clearAll(){
        this.line_id = null;
        this.returned=0;
        this.directional=null;
      }
    },
    
  }
</script>