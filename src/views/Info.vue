<template>
  <v-card color="amber lighten-2" dark>
    <v-snackbar v-model="snackbar" top color="warning" timeout="2000">{{message}}</v-snackbar>
    <v-card-title class="text-h5 amber lighten-3">
      查询线路信息
    </v-card-title>
    <v-row>
      <v-col cols="6">
    <v-card-text >
      <v-text-field v-model="line_id" placeholder="请输入线路名" label="请输入线路名"></v-text-field>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-radio-group v-model="directional">
          <v-radio label="不区分上下行" value="off"></v-radio>
          <v-radio label="上行" value="上行"></v-radio>
          <v-radio label="下行" value="下行"></v-radio>
      </v-radio-group>
    </v-card-actions>
    

    <v-divider></v-divider>
    
    
      
    <v-card-actions>
      <v-btn color="amber darken-3" :disabled="line_id===null" @click="getBasicInfo()">
        查询线路基本信息
        <v-icon right>
          mdi-magnify
        </v-icon>
      </v-btn>
      
      <v-btn color="amber darken-3" :disabled="line_id===null"  @click="getShift()">
        查询全部班次
        <v-icon right>
          mdi-magnify-expand
        </v-icon>
      </v-btn>

      <v-btn color="amber darken-3" :disabled="line_id===null" @click="getPlatform()">
        查询全部站台
        <v-icon right>
          mdi-database-search
        </v-icon>
      </v-btn>

      <v-btn :disabled="!line_id" color="grey darken-3" @click="clearAll">
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
            <v-row align="center">
              <v-col>
                <v-card color="light-blue lighten-3"  flat>
                  <v-card-title>{{basicInfo.route}} <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{line_id}}路公交车 </v-card-title>

                  <v-card-text>
                    <v-row class="mb-4" align="center">
                      <v-col cols="6">
                        单次时间：{{basicInfo.onewayTime}} <v-icon>mdi-alarm-check</v-icon>
                      </v-col>
                      <v-col cols="6">
                        <span v-show="basicInfo.directional==='TRUE'">方向：双向<v-icon>mdi-swap-horizontal</v-icon></span>
                        <span v-show="basicInfo.directional==='FALSE'">方向：单向<v-icon>mdi-arrow-right</v-icon></span>
                      </v-col>                          
                    </v-row>

                    <v-row class="mb-4" align="center">
                      <v-col cols="6">
                        <v-icon></v-icon>里程数：{{basicInfo.kilometer}} 公里
                      </v-col>
                      <v-col cols="6">
                        <v-icon></v-icon>类型：{{basicInfo.type}}
                      </v-col>
                    </v-row>

                    <v-row class="mb-4" align="center">
                      <v-col cols="6">
                        运营时间：{{basicInfo.timetable}} <v-icon>mdi-bus-clock</v-icon>
                      </v-col>
                      <v-col cols="6">
                        发车间隔：{{basicInfo.interval}}分钟  <v-icon>mdi-clipboard-text-clock-outline</v-icon>
                      </v-col>
                    </v-row>
                  </v-card-text>
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
                    <v-card-title> <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{line_id}}路公交车 </v-card-title>
                      <v-sheet class="overflow-y-auto" height="400">
                        <v-data-table :headers="headers" :items="platforms"  :items-per-page="5">
                            <template v-slot:item.arrivedTime="{item}">
                              <v-sheet class="overflow-y-auto" height="200">
                                <v-timeline dense>
                                  <v-timeline-item v-for="time of item.arrivedTime" small>
                                    {{time}} 

                                  </v-timeline-item>
                                </v-timeline>
                              </v-sheet>
                            </template>
                        </v-data-table>
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
                  <v-card-title>{{basicInfo.route}} <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{line_id}}路公交车 </v-card-title>
                    <v-sheet class="overflow-y-auto" height="400">
                      <v-timeline dense>
                        <v-timeline-item v-for="platform of platforms" small>
                          {{platform.name}} {{platform.english}}

                        </v-timeline-item>
                      </v-timeline>
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
      descriptionLimit: 30,
      entries: [],
      isLoading: false,
      line_id: null,
      search: null,
      returned:0,
      length: 3,
      window: 0,
      basicInfo:{},
      directional:null,
      platforms:[],
      headers:[],
      newTime:[],
      message:null,
      snackbar:false,
    }),
    methods:{
      checkRound(){
        let reg=new RegExp(/^.*环线$/);
        return reg.test(this.line_id);
      },
      
      getBasicInfo(){
        let that=this;
        this.basicInfo={};
        axios.get('http://localhost:8081/nosql/LineController/listLineInfo',  {
            params: {
              line_id:this.line_id
            }
          })
            .then(response => {
              console.log(response.data);
              if(response.data===null){
                  that.message="无该线路";
                  that.snackbar=true;
              }
              else{
                that.returned=1;
                that.basicInfo=response.data;
              }
            })
            .catch(error => {
              alert('获取线路失败!\n' + error.message);
            })
            .finally(() => {
              this.loading = false;
            });
      },
      
      getShift(){
          this.loading=true;
          let that=this;
          let param=that.line_id+'路';
          if(this.directional!==null&&this.directional!=="off"){
            param+=that.directional;
          }
          
          axios.get('http://localhost:8081/nosql/StationController/listDepartInfo',  
          {
            params: {
              name:param
            }
          })
          .then(response => {
              
              console.log(response);
              if(response.data===""){
                  that.message="无该线路";
                  that.snackbar=true;
              }
              else{
                that.returned=2;
                that.platforms=response.data;
              }

          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              this.loading = false;
              this.headers=[{text:"name",value:"stationName"},{text:"time",value:"arrivedTime"}];
          });
      },

      getPlatform(){
          this.loading = true;
          let that = this;
          let param=that.line_id+'路';
          this.basicInfo={};
          if(this.directional!=="off")
            param+=that.directional;
          axios.get('http://localhost:8081/nosql/StationController/listStationInfo',  {
          params: {
            name:param
          }
          })
          .then(response => {
              console.log(response)
              if(response.data===""){
                  that.message="无该线路";
                  that.snackbar=true; 
              }
              else{
                that.returned=3;
                that.platforms=response.data;
              }

          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              this.loading = false;
              console.log(this.returned);

          });
      },


      clearAll(){
        this.line_id = null;
        this.returned=0;
        this.directional=null;
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