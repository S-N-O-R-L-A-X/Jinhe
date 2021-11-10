<template>
  <v-card>
      <v-card-title>站台查询</v-card-title>
      <!-- <v-container> -->
      <v-text-field placeholder="输入线路">aa</v-text-field>
      <!-- <v-radio-group>
          <v-radio :value="all">全部</v-radio>
          <v-radio>上行</v-radio>
          <v-radio>下行</v-radio>
      </v-radio-group> -->
      <!-- </v-container> -->
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