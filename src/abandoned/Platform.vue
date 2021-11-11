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
      <v-radio-group>
          <v-radio label="不区分上下行"></v-radio>
          <v-radio label="上行"></v-radio>
          <v-radio label="下行"></v-radio>
      </v-radio-group>
    </v-card-actions>
    
    <v-divider></v-divider>
    
    <v-card-actions>
      <v-btn color="amber darken-3" @click="getBasicInfo()">
        Search
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!model"
        color="grey darken-3"
        @click="model = null"
      >
        Clear
        <v-icon right>
          mdi-close-circle
        </v-icon>
      </v-btn>
    </v-card-actions>
    </v-col>
    <v-col cols="6">
        <v-expand-transition offset--x>
          
          <div v-show="returned===2">
            <v-row align="center">
              <v-item-group v-model="window" class="shrink mr-6" mandatory>
                <v-item v-for="n in length"
                  :key="n" v-slot:default="{ active, toggle }">
                  <div>
                    <v-btn :input-value="active" icon @click="toggle">
                      <v-icon>mdi-record</v-icon>
                    </v-btn>
                  </div>
                </v-item>
              </v-item-group>

              <v-col>
                <v-window v-model="window" class="elevation-1" vertical>
                  <v-window-item
                    v-for="n in length"
                    :key="n"
                  >
                    <v-card flat>
                      <v-card-text>
                        <v-row class="mb-4" align="center">
                          <v-avatar color="grey" class="mr-4"></v-avatar>
                          <strong class="title">Title {{ n }}</strong>
                          <v-spacer></v-spacer>
                          <v-btn icon>
                            <v-icon>mdi-account</v-icon>
                          </v-btn>
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
    methods: {
        fetchPrescription(){
            this.loading = true;
            let that = this;
            axios.get('http://localhost:8081/nosql/StationController/listStationInfo',  {
            params: {

            }
            })
            .then(response => {
                
            })
            .catch(error => {
                alert('获取处方失败：无法连接到服务器，刷新重试。\n' + error.message);
            })
            .finally(() => {
                this.loading = false;
            });
        }
    }
}
</script>

<style>

</style>