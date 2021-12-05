<template>
  <v-card
    color="amber lighten-2"
    dark
  >
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
      <v-btn color="amber darken-3" @click="getBasicInfo()">
        Search
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
      
      <v-btn color="amber darken-3" @click="testCalendar()">
        Search
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
                  <v-card-title>{{basicInfo.route}} <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{basicInfo.line_id}}路公交车 </v-card-title>

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
                    <v-card-title>{{basicInfo.route}} <v-spacer></v-spacer><v-avatar><v-icon>mdi-bus-side</v-icon></v-avatar> {{basicInfo.line_id}}路公交车 </v-card-title>
                    <v-sheet height="400">
                      <v-calendar type="day" v-for="event of events" :event-overlap-threshold="30"></v-calendar>
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
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      events:[],
    }),
    methods:{
      getBasicInfo(){
        let that=this;
        console.log(this.line_id);
        axios.get('http://localhost:8081/nosql/LineController/listLineInfo',  {
            params: {
              line_id:this.line_id
            }
          })
            .then(response => {
              that.basicInfo = response.data;
              console.log(that.basicInfo);
              that.returned=1;
            })
            .catch(error => {
              alert('获取线路失败!\n' + error.message);
            })
            .finally(() => {
              this.loading = false;
            });
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
      testCalendar(){
        let events=[];
         
        for (let i = 0; i < 10; i++) {
          // const min = new Date(`T00:00:00`)
          // const max = new Date(`T23:59:59`)
          const min=new Date(2021,11,12,0,0,0);
          const max=new Date(2021,11,12,23,59,59);
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)
          
          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: first,
            end: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          })
        }

        this.events = events;
        console.log(this.events);
        this.returned=2;
      },
      getShift(){
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
              this.returned=2;
          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
          })
          .finally(() => {
              this.loading = false;
              this.returned=2;
              console.log(this.platforms);
          });
      },
      clearAll(){
        this.line_id = null;
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