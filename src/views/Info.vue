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
      <v-spacer></v-spacer>
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
              alert('获取线路失败：无法连接到服务器，刷新重试。\n' + error.message);
            })
            .finally(() => {
              
              this.loading = false;
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