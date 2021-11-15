<template>
<v-navigation-drawer width="300" app clipped>
  <v-card height="100%" color="amber">
    
    <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <v-list-group
        :value="true"
        prepend-icon="mdi-account-circle"
      >
        <template v-slot:activator>
          <v-list-item-title>Users</v-list-item-title>
        </template>

        <v-list-group
          :value="true"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Admin</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="([title, icon], i) in admins"
            :key="i"
            link
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Actions</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="([title, icon], i) in cruds"
            :key="i"
            link
          >
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
</template>
  
  <script>
  export default {
  
  }
  </script>
  
  <style>
  
  </style>
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
        ['Management', 'mdi-account-multiple-outline'],
        ['Settings', 'mdi-cog-outline'],
      ],
      cruds: [
        ['Create', 'mdi-plus-outline'],
        ['Read', 'mdi-file-outline'],
        ['Update', 'mdi-update'],
        ['Delete', 'mdi-delete'],
      ],
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
      
      getShift(){
          this.loading = true;
          let that = this;
          let param=that.line_id+'路'+that.directional;
          axios.get('http://localhost:8081/nosql/LineController/listShortestRouteByStationId?start=16115&end=14768',  
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