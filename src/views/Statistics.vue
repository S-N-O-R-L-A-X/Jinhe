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
        <v-col cols="3">
          地铁站
          <v-data-table :headers="headers" :items="platforms" :items-per-page="15" class="elevation-1">
          </v-data-table>
        </v-col>

        <v-col cols="3">
          起点站
          <v-data-table :headers="headers" :items="platforms" :items-per-page="15" class="elevation-1">
          </v-data-table>
        </v-col>

        <v-col cols="3">
          终点站
          <v-data-table :headers="headers" :items="platforms" :items-per-page="15" class="elevation-1">
          </v-data-table>
        </v-col>

        <v-col cols="3">
          单行站
          <v-data-table :headers="headers" :items="platforms" :items-per-page="15" class="elevation-1">
          </v-data-table>
        </v-col>
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
      admins: [
        ['停靠路线最多的站点','mdi-account-multiple-outline'],
        ['统计换乘线路数量', 'mdi-account-multiple-outline'],
        ['统计特殊站台的数量', 'mdi-cog-outline'],
      ],
      cruds: [
        ['Create', 'mdi-plus-outline'],
        ['Read', 'mdi-file-outline'],
        ['Update', 'mdi-update'],
        ['Delete', 'mdi-delete'],
      ],
      headers:[],
      items:[],
      endStation:[],
      underground:[],
      lines:[],
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
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
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
              that.platforms=response.data;
              this.returned=2;
          })
          .catch(error => {
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
          })
          .finally(() => {
              this.loading = false;
              
              console.log(this.platforms);
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
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
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
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
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
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
          })
          .finally(() => {
              console.log(this.lines);
              this.headers=[{text:'类型',value:'type'},{text:'运行时间(单位：分钟)',value:'time'}];

              this.loading = false;
              this.returned=5;
              
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