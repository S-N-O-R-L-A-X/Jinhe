<template>
  <v-card
    color="amber lighten-2"
    dark
  >
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
      <v-btn color="amber darken-3" @click="getRoute_withID()">
        查询路线情况
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
      
      <v-btn color="amber darken-3" :disabled="directional==='off'" @click="getShortestRoute()">
        查询最短路线
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>

      <v-btn color="amber darken-3" :disabled="directional==='off'" @click="getPlatform()">
        查询全部站台
        <v-icon right>
          mdi-close-circle
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
                  <v-card-title>{{route_withID.route}} <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{line_id}}路公交车 </v-card-title>
                    <v-card-text>
                        <v-row class="mb-4" align="center">
                        <v-col cols="6">
                            单次时间：{{route_withID.onewayTime}} <v-icon>mdi-alarm-check</v-icon>
                        </v-col>
                        <v-col cols="6">
                            <span v-show="route_withID.directional==='TRUE'">方向：双向<v-icon>mdi-swap-horizontal</v-icon></span>
                            <span v-show="route_withID.directional==='FALSE'">方向：单向<v-icon>mdi-arrow-right</v-icon></span>
                        </v-col>                          
                        </v-row>
                    </v-card-text>
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

        <v-expand-transition offset--x>
          <div v-show="returned===2">
              <v-row align="center">
                <v-col>
                  <v-card color="light-blue lighten-3"  flat>
                    <v-card-title>{{route_withID.route}} <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{line_id}}路公交车 </v-card-title>
                      <v-sheet height="300">
                        <v-timeline>
                          <v-timeline-item v-for="platform of platforms" dense>
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
          <div v-show="returned===3">
            <v-row align="center">
              <v-col>
                <v-card color="light-blue lighten-3"  flat>
                  <v-card-title>{{route_withID.route}} <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{line_id}}路公交车 </v-card-title>
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
      route_withID:{},
      directional:null,
      platforms:[],
      starting:null,
      destination:null,
    }),
    methods:{
      getRoute_withID(){
        let that=this;
        console.log(this.line_id);
        axios.get('http://localhost:8081/nosql/LineController/listRouteWithLineTen',  {
            params: {
              line_id:this.line_id,
              start:this.starting,
              end:this.destination
            }
          })
            .then(response => {
              that.route_withID = response.data;
              console.log(that.route_withID);
              that.returned=1;
            })
            .catch(error => {
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
            })
            .finally(() => {
              this.loading = false;
            });
      },
      
      getShortestRoute(){
          this.loading = true;
          let that = this;
          
          axios.get('http://localhost:8081/nosql/LineController/listShortestRouteByStationId',  {
          params: {
            start:this.starting,
            end:this.destination
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
              this.returned=2;
              console.log(this.platforms);
          });
      },

      getPlatform(){
          this.loading = true;
          let that = this;
          let param=that.line_id+'路'+that.directional;
          axios.get('http://localhost:8081/nosql/StationController/listStationInfo',  {
          params: {
            name:param
          }
          })
          .then(response => {
              that.platforms=response.data;
          })
          .catch(error => {
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
          })
          .finally(() => {
              this.loading = false;
              this.returned=3;
              console.log(this.platforms);
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