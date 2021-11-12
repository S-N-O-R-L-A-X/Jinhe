<template>
  <v-card
    color="amber lighten-2"
    dark
  >
    <v-card-title class="text-h5 amber lighten-3">站台查询</v-card-title>
    
    <v-row>
      <v-col cols="6">
    <v-card-text>
      <v-text-field v-model="line_id" placeholder="请输入线路名" label="请输入线路名"></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-radio-group v-model="directional">
          <!-- <v-radio label="不区分上下行"></v-radio> -->
          <v-radio label="上行" value="上行"></v-radio>
          <v-radio label="下行" value="下行"></v-radio>
      </v-radio-group>
    </v-card-actions>
    
    <v-divider></v-divider>
    
    <v-card-actions>
      <v-btn color="amber darken-3" @click="getPlatform()">
        Search
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="!line_id" color="grey darken-3" @click="clearAll()">
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
              <v-timeline>
                <v-timeline-item v-for="platform of platforms" dense>
                  {{platform.name}} {{platform.english}}

                </v-timeline-item>
              </v-timeline>
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
      isLoading: false,
      line_id: null,
      search: null,
      returned:0,
      length: 3,
      window: 0,
      directional:null,
      platforms:[],
    }),
    methods: {
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
                this.returned=1;
                console.log(this.platforms);
            });
        },
        clearAll(){
          this.line_id = null;
          this.returned=0;
          this.directional=null;
        }
    }
}
</script>

<style>

</style>