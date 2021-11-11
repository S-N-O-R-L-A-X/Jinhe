<template>
  <v-card
    color="amber lighten-2"
    dark
  >
    <v-card-title class="text-h5 amber lighten-3">站台查询</v-card-title>
    
    <v-row>
      <v-col cols="6">
    <v-card-text>
      <v-autocomplete v-model="model" :items="items" :loading="isLoading" :search-input.sync="search" color="white" hide-no-data hide-selected item-text="Description" item-value="API"
        label="请在此输入线路名" placeholder="输入线路名" prepend-icon="mdi-database-search" return-object>
      </v-autocomplete>
    </v-card-text>

    <v-card-actions>
      <v-radio-group>
          <v-radio :value="all">全部</v-radio>
          <v-radio>上行</v-radio>
          <v-radio>下行</v-radio>
      </v-radio-group>
    </v-card-actions>
    
    <v-divider></v-divider>
    <v-expand-transition>
      <v-list v-if="model" class="amber lighten-3">
        <v-list-item
          v-for="(field,i) in fields"
          :key="i"
        >
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
              <v-item-group v-model="window" class="shrink mr-6" mandatory tag="v-flex">
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

                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>

                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>

                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
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
    data(){

    },
    methods: {
        fetchPrescription(){
            this.loading = true;
            let that = this;
            axios.get('http://localhost:7474/',  {
            params: {
                patient_id: 5,
                page:1,
                size:50
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