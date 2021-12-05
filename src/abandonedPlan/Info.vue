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
    <v-card-text>
      <v-autocomplete v-model="line_id" :items="items" :loading="isLoading" :search-input.sync="search" color="white" hide-no-data hide-selected item-text="Description" item-value="API"
        label="请在此输入线路名" placeholder="输入线路名" prepend-icon="mdi-database-search" return-object>
      </v-autocomplete>
    </v-card-text>
    <v-divider></v-divider>
    <v-expand-transition>
      <v-list v-if="line_id" class="amber lighten-3">
        <v-list-item v-for="(field,i) in fields" :key="i">
          <v-list-item-content>
            <v-list-item-title v-text="field.value"></v-list-item-title>
            <v-list-item-subtitle v-text="field.key"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expand-transition>
    <v-card-actions>
      <v-btn color="amber darken-3" @click="getBasicInfo()">
        Search
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="!line_id" color="grey darken-3" @click="line_id = null">
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
              <v-item-group v-model="window" class="shrink mr-6" mandatory><!--tag="v-flex" -->
                <v-item v-for="n in length" :key="n" v-slot:default="{ active, toggle }">
                  <div>
                    <v-btn :input-value="active" icon @click="toggle">
                      <v-icon>mdi-record</v-icon>
                    </v-btn>
                  </div>
                </v-item>
              </v-item-group>

              <v-col>
                <v-window v-model="window" class="elevation-1" vertical>
                  <v-window-item v-for="n in length" :key="n">
                    <v-card flat>
                      <v-card-title>{{basicInfo.name}}<v-avatar><span>{{basicInfo.name}}</span></v-avatar></v-card-title>

                      <v-card-text>
                        <v-row class="mb-4" align="center">
                          <v-col cols="6">
                            <v-icon></v-icon>单次时间：{{basicInfo.onewayTime}}
                          </v-col>
                          <v-col cols="6">
                            <span v-show="basicInfo.directional==='TRUE'"><v-icon>mdi-ArrowLeftRightBold</v-icon>方向：双向</span>
                            <span v-show="basicInfo.directional==='FALSE'"><v-icon>mdi-ArrowLeftRightBold</v-icon>方向：单向</span>
                          </v-col>                          
                        </v-row>

                        <v-row class="mb-4" align="center">
                          <v-col cols="6">
                            <v-icon></v-icon>里程数：{{basicInfo.kilometer}}
                          </v-col>
                          <v-col cols="6">
                            <v-icon></v-icon>类型：{{basicInfo.type}}
                          </v-col>
                        </v-row>
                       
                      </v-card-text>
                    </v-card>
                  </v-window-item>
                </v-window>
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
              alert('获取线路失败!\n' + error.message);
            })
            .finally(() => {
              
              this.loading = false;
            });
      },
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