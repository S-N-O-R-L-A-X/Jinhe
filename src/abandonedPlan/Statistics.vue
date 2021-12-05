<template>
<div>
  <v-navigation-drawer width="300" app clipped>
    <v-card height="100%" color="amber">
      
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>a</v-list-item-title>
        </v-list-item>

        <v-list-group
          :value="true"
          prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-item-title>Users</v-list-item-title>
          </template>

          <v-list-group :value="true" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Admin</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="([title, icon], i) in admins" :key="i" link><!--@click="functions[i]" -->
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>

          <v-list-group no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Actions</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="([title, icon], i) in cruds" :key="i" link>
              <v-list-item-title v-text="title"></v-list-item-title>

              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list-group>
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
      underground:[],
      lines:[],
      funcs:[getPlatformWithMostRoutes(),],
    }),
    methods:{
      getPlatformWithMostRoutes(){
        let that=this;
        
        axios.get('http://localhost:8081/nosql/StationController/listNMostLine',  {
            params: {
              num:1000
            }
          })
            .then(response => {
              console.log(that.basicInfo);
              that.platforms=response.data;
              that.returned=1;
            })
            .catch(error => {
              alert('获取线路失败!\n' + error.message);
            })
            .finally(() => {
              this.loading = false;
              this.headers=["站台名","经过线路数","经过线路名"];
              
            });
      },
      
      getSpecialPlatforms(){
          this.loading = true;
          let that = this;
          let param=that.line_id+'路'+that.directional;
          axios.get('http://localhost:8081/nosql/LineController/listLineTypeCount',  
          {
            params: {
              name:param,
              start:starting,
              end:destination
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

      getLineNumbers(){
          this.loading = true;
          let that = this;
          
          axios.get('http://localhost:8081/nosql/LineController/listTransLineCount?lineName=261%E8%B7%AF%E4%B8%8A%E8%A1%8C',  {
          params: {
            name:param
          }
          })
          .then(response => {
              that.lines=response.data;
          })
          .catch(error => {
              alert('获取线路失败!\n' + error.message);
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