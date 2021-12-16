<template>
  <v-card color="amber lighten-2">
    <v-snackbar v-model="snackbar" top color="warning" timeout="2000">{{message}}</v-snackbar>
    <v-card-title class="text-h5 amber lighten-3">
      查询路线
    </v-card-title>
    <v-row>
      <v-col cols="6">
    <v-card-text>
      <v-text-field v-model="line_id" placeholder="请输入线路名" label="请输入线路名"></v-text-field>
      <v-text-field v-model="starting" placeholder="请输入起点站" label="请输入起点站"></v-text-field>
      <v-text-field v-model="destination" placeholder="请输入终点站" label="请输入终点站"></v-text-field>
    </v-card-text>
    <v-divider></v-divider>
      
    <v-card-actions>
      <v-btn color="amber darken-3" :disabled="line_id===null||starting===null||destination===null" @click="getRouteWithID()">
        查询路线情况
        <v-icon right>
          mdi-magnify
        </v-icon>
      </v-btn>
      
      <v-btn color="amber darken-3" :disabled="line_id!==null||starting===null||destination===null" @click="getShortestRoute()">
        查询最短路线
        <v-icon right>
          mdi-magnify-expand
        </v-icon>
      </v-btn>

      <v-btn color="amber darken-3" :disabled="line_id===null||starting!==null||destination!==null" @click="getSinglePlatforms()">
        查询单行站
        <v-icon right>
          mdi-database-search
        </v-icon>
      </v-btn>

      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="amber darken-3" :disabled="line_id!==null||starting!==null||destination!==null" v-bind="attrs" v-on="on">
            新增线路 +
          </v-btn>
        </template>
        <v-card>
          <v-toolbar dark color="amber">
            <v-btn icon dark @click="dialog=false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>增加线路</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="addNewLine()">
                保存线路并添加
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <template>
            <v-stepper v-model="e1" vertical>
                <v-stepper-step :complete="e1>1" step="1">Name of step 1</v-stepper-step>
                 <v-stepper-content step="1">
                  <v-card  color="white">
                    <v-card-title>输入基本信息</v-card-title>
                    <v-row>
                      <v-col cols="3">
                        <v-text-field v-model="id" label="id"></v-text-field>
                      </v-col>

                      <v-col cols="3">路线总长度
                        <v-slider v-model="slide1.distance" :label="slide1.label" :color="slide1.color" :thumb-color="slide1.thumbColor" thumb-label="always" :min=10 :max=100>
                        </v-slider>
                      </v-col>

                      <v-col cols="3">
                        <v-container id="dropdown-example-3">
                          <v-overflow-btn class="my-2" :items="allTypes"
                            label="线路类型" editable item-value="type" v-model="type">
                          </v-overflow-btn>
                        </v-container>
                      </v-col>
                      <v-col cols="3">班车间隔
                        <v-slider v-model="slide2.shift" :label="slide2.label" :color="slide2.color" :thumb-color="slide2.thumbColor" thumb-label="always" :min=1>
                        </v-slider>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <v-radio-group v-model="directional">
                            <v-radio label="双向" value="true"></v-radio>
                            <v-radio label="单向" value="false"></v-radio>
                        </v-radio-group>
                      </v-col>                          

                    </v-row>
                    <v-btn color="primary" @click="e1=2">Continue</v-btn>
                  </v-card>
                </v-stepper-content>
                
                <v-stepper-step :complete="e1>2" step="2">Name of step 2</v-stepper-step>
                <v-stepper-content step="2">
                  <v-card color="white" height="500">
                    <v-row>
                      <v-col cols="3">运营开始时间：
                        <v-time-picker v-model="startTime" :allowed-minutes="allowedStep" class="mt-4" format="24hr"></v-time-picker>
                      </v-col>
                      <v-col cols="3">运营结束时间：
                        <v-time-picker v-model="endTime" :allowed-minutes="allowedStep" class="mt-4" format="24hr"></v-time-picker>
                      </v-col>
                    </v-row>
                    <v-btn color="primary" @click="e1=3">Continue</v-btn>
                  </v-card>

                </v-stepper-content>


                <v-stepper-step step="3">Name of step 3</v-stepper-step>
                <v-stepper-content step="3">
                  <v-card color="white" height="400">
                    <v-card-title>添加站台</v-card-title>
                    <v-row>
                      <v-col cols="3">
                        <v-text-field  v-model="platform_id" :rules="rules.id" color="amber darken-1" label="站台id" required></v-text-field>
                      </v-col>
                      <v-col cols="3">两站时间间隔
                        <v-slider v-model="slide3.timeCost" :label="slide3.label" :color="slide3.color" :thumb-color="slide3.thumbColor" thumb-label="always" :min=1></v-slider>
                      </v-col>
                      <v-col cols="3">
                        <v-btn color="primary" :disabled="!platform_id" @click="addNewPlatforms()">添加站台</v-btn>
                      </v-col>
                    </v-row>
                    
                    <v-row>
                      <v-col cols="12">
                        <v-chip-group>
                          <v-chip v-for="(newPlatform,idx) in newPlatforms" :key="idx">
                            {{newPlatform.id}}:{{newPlatform.runtime}}
                          </v-chip>
                        </v-chip-group>
                      </v-col>
                    </v-row>
                    <v-btn color="primary" @click="e1=1">Continue</v-btn>
                  </v-card>
                  
                </v-stepper-content>
            </v-stepper>
          </template>
                    
        </v-card>
      </v-dialog>
      
      <!-- <v-btn color="amber darken-3" @click="addNewLineTest()">
        测试
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn> -->

      <v-btn :disabled="line_id===null" color="amber darken-3" @click="deleteLine()">
        删除路线
        <v-icon right>mdi-close-circle</v-icon>
      </v-btn>

      <v-btn :disabled="!line_id&&!starting&&!destination" color="grey darken-3 white--text" @click="clearAll">
        Clear
        <v-icon right>mdi-close-circle</v-icon>
      </v-btn>

    </v-card-actions>
    </v-col>
    <v-col cols="6">
        <v-expand-transition offset--x>
          <div v-show="returned===1">
            <v-row align="center">
              <v-col>
                <v-card color="light-blue lighten-3"  flat>
                  <v-card-title>{{route_withID.route}} <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{line_id}}路公交车 </v-card-title>
                    <v-card-text>
                        <v-row class="mb-4" align="center">
                        <v-col cols="6">
                            运行时间：{{route_withID.runtime}} <v-icon>mdi-alarm-check</v-icon>
                        </v-col>

                        <v-col cols="6">
                            <span v-show="up_or_down===true">线路运行方向：上行<v-icon>mdi-swap-horizontal</v-icon></span>
                            <span v-show="up_or_down===false">线路运行方向：下行<v-icon>mdi-arrow-right</v-icon></span>
                        </v-col>                          
                        </v-row>
                        沿路站点：
                    </v-card-text>
                    <v-sheet class="overflow-y-auto" height="300">
                      
                      <v-timeline dense>
                        <v-timeline-item v-for="platform of route_withID.alongStation" small>
                          {{platform.name}} {{platform.english}}
                        </v-timeline-item>
                      </v-timeline>
                    </v-sheet>
                </v-card>
              </v-col>

            </v-row>
          </div>
          
        </v-expand-transition>

        <v-expand-transition offset--x>
          <div v-show="returned===2">
            <v-row align="center">
              <v-col>
                <v-card color="light-blue lighten-3"  flat>
                  <v-card-title>共{{n}}站 <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar></v-card-title>
                    <v-sheet class="overflow-y-auto" height="300">
                      <v-timeline dense>
                        <v-timeline-item v-for="(alongStation,index) in alongStations" :key="index" small>
                          <v-card v-if="index===0||transLines[index]===transLines[index-1]">
                            {{alongStations[index].name}} 乘坐 {{transLines[index]}}
                          </v-card>
                          <v-card v-else-if="index===transLines.length">
                            {{alongStations[index].name}} 终点站
                          </v-card>

                          <v-card v-else>
                            <v-icon>mdi-arrow-left-right-bold</v-icon>{{alongStations[index].name}} 换乘 {{transLines[index]}}
                          </v-card>
                        </v-timeline-item>
                      </v-timeline>
                    </v-sheet>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        
        <v-expand-transition offset--x>
          <div v-show="returned===3">
            <v-row align="center">
              <v-col>
                <v-card color="light-blue lighten-3"  flat>
                  <v-card-title>单行站 <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{line_id}}路公交车 </v-card-title>
                    <v-sheet class="overflow-y-auto" height="400">
                      
                        <v-data-table :headers="headers" :items="singlePlatforms.singleDir" :items-per-page="15" class="elevation-1">
                        </v-data-table>
                    </v-sheet>
                </v-card>
              </v-col>

            </v-row>
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
      line_id: null,
      returned:0,
      route_withID:{},
      directional:null,
      platforms:{},
      starting:null,
      destination:null,
      up_or_down:null,
      n:0,
      alongStations:[],
      transLines:[],
      dialog: false,
      notifications: false,
      startTime:"0:00",
      endTime:"0:00",
      e1:1,
      type:null,
      id:null,

      allTypes:[{text:'干线'},{text:'环线'},{text:'夜班线'},{text:'高峰线'},{text:'支线'},
      {text:'城乡线'},{text:'驳接线'},{text:'社区线'},{text:'快速公交'}],
      
      allowedStep: m => m % 1 === 0,
      rules:{id:[val => (val || '').length > 0 || 'This field is required'],},
      platform_id:null,
      slide1:{distance:1,label:"单位：公里",color:"yellow",thumbColor:"orange"},
      slide2:{shift:1,label:"单位：分钟",color:"yellow",thumbColor:"orange"},
      slide3:{timeCost:1,label:"单位：分钟",color:"yellow",thumbColor:"orange"},
      newPlatforms:[],
      message:null,
      snackbar:false,
      singlePlatforms:{},
      headers:[],

    }),
    methods:{
      getRouteWithID(){
        let that=this;
        this.returned=0;
        console.log(this.line_id);
        axios.get('http://localhost:8081/nosql/LineController/listRouteWithLine',  {
            params: {
              lineId:this.line_id,
              start:this.starting,
              end:this.destination
            }
          })
            .then(response => {
              console.log(response);
              if(response.data===null){
                that.snackbar=true;
                that.message="站台不存在或线路不存在！"
              }
              else{
                that.returned=1;
                that.route_withID = response.data;
                that.up_or_down=that.route_withID.direction.endsWith('上行');
              }
              
            })
            .catch(error => {
              alert('获取线路失败!\n' + error.message);
            })
            .finally(() => {
              this.loading = false;
              

            });
      },
      
      getShortestRoute(){
          this.loading = true;
          let that = this;
          this.returned=0;
          axios.get('http://localhost:8081/nosql/LineController/listShortestRouteByStation',  {
          params: {
            start:this.starting,
            end:this.destination
          }
          })
          .then(response => {
            if(response.data===null){
              that.snackbar=true;
              that.message="找不到路线！";
            }
            else{
              that.platforms=response.data;
              that.alongStations=response.data.alongStation;
              that.transLines=response.data.transLine;
              that.returned=2;
              that.n=that.alongStations.length;
            }
              
          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              this.loading = false;
              
              

          });
      },

      getSinglePlatforms(){
          this.loading = true;
          let that = this;
          this.returned=0;
          axios.get('http://localhost:8081/nosql/StationController/listSingleDirectStation',{
            params: {
              lineId:this.line_id
            }
          })
          .then(response => {
              that.singlePlatforms=response.data;
              console.log(this.singlePlatforms);
              this.returned=3;
          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              this.headers=[{text:"id",value:"id"},{text:"站台名",value:"name"}];
              
          });
      },

      addNewPlatforms(){
        let obj={};
        obj.id=this.platform_id;
        obj.runtime=this.startTime;
        if(this.newPlatforms.length>0){
          obj.runtime=this.slide3.timeCost;
        }
        this.newPlatforms.push(obj);
        this.platform_id=null;
        this.slide3.timeCost=1;
      },


      addNewLine(){
          this.loading = true;
          let that = this,runtime=this.startTime+'-'+this.endTime;
          
          if(!this.id||!this.directional||!this.slide1.distance
          ||!this.startTime||!this.endTime||this.newPlatforms.length===0||!this.type){
            console.log("return!");
            this.snackbar=true;
            this.message="您有信息没填！";
            return ;
          }

          axios.post('api/nosql/LineController/insertLine',  {
            params:{
              line:{
                id:this.id,
                directional:this.directional,
                kilometer:this.slide1.distance,
                runtime:runtime,
                interval:this.slide2.shift,
                type:this.type,
              },
              stationList: this.newPlatforms,
            }  
          })
          .then(response => {
              console.log(response);

              this.message="创建线路成功！";
              this.snackbar=true;
          })
          .catch(error => {
              alert('添加线路失败!\n' + error.message);
          })
          .finally(() => {
              this.loading=false;
              this.dialog=false;              
          });
      },
      // addNewLineTest(){
      //   axios({
      //     method:"post",
      //     changeOrigin:"true",
      //     url:"api/nosql/LineController/insertLine",
          
      //     data: {
      //         line:{
      //           id:3,
      //           directional:true,
      //           kilometer:15,
      //           runtime:"6:00-23:59",
      //           interval:5,
      //           type:"strong",
      //         },
      //         stationList: [{"id":"21460","runtime":"6:00"},{"id": "41394","runtime":"3"}],

      //     }
      //   })
      //     .then(response => {
      //         console.log(response);
      //         this.message="创建线路成功！";
      //         this.snackbar=true;
      //     })
      //     .catch(error => {
      //         alert('添加线路失败!\n' + error.message);
      //     })
      //     .finally(() => {
      //         this.loading=false;
      //         this.dialog=false;              
      //     });

      // },
      
      
      deleteLine(){
          this.loading = true;
          let that = this;
          axios.get('api/nosql/LineController/deleteLine',  {
          params: {
              lineId:this.line_id,
          }
          })
          .then(response => {
            console.log(response);
            if(response.data==="线路不存在"){
              this.snackbar=true;
              this.message="线路不存在，删除线路失败！";
            }
            else{
              this.snackbar=true;
              this.message="删除线路成功！";
            }
          })
          .catch(error => {
              alert('添加线路失败!\n' + error.message);
          })
          .finally(() => {
            this.loading=false;
          });
      },
      clearAll(){
        this.line_id=null;
        this.starting=null;
        this.destination=null;
        this.returned=0;
      }
    },
    
    computed: {
      fields () {
        if (!this.line_id) return []

        return Object.keys(this.line_id).map(key => {
          return {
            key,
            value: this.line_id[key] || 'n/a',
          }
        })
      },
      items () {
        return this.entries.map(entry => {
          const Description = entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + '...'
            : entry.Description

          return Object.assign({}, entry, { Description })
        })
      },
    },

    watch: {
      search (val) {
        // Items have already been loaded
        if (this.items.length > 0) 
          return ;

        // Items have already been requested
        if (this.isLoading) 
          return ;

        this.isLoading = true

        // Lazily load input items
        // fetch('https://api.publicapis.org/entries')
        //   .then(res => res.json())
        //   .then(res => {
        //     const { count, entries } = res
        //     this.count = count
        //     this.entries = entries
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
        //   .finally(() => (this.isLoading = false))
      },
    },
  }
</script>