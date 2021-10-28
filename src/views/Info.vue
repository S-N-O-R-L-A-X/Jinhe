<template>
  <v-card
    color="amber lighten-2"
    dark
  >
    <v-card-title class="text-h5 amber lighten-3">
      查询线路信息
    </v-card-title>

    <v-card-text>
      <v-autocomplete
        v-model="model" :items="items" :loading="isLoading"
        :search-input.sync="search"
        color="white" hide-no-data hide-selected
        item-text="Description" item-value="API"
        label="请在此输入线路名" placeholder="输入线路名"
        prepend-icon="mdi-database-search" return-object>
      </v-autocomplete>
    </v-card-text>
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
  </v-card>
</template>
<script>
  import axios from "axios"
  export default {
    data: () => ({
      descriptionLimit: 30,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
    }),

    computed: {
      fields () {
        if (!this.model) return []

        return Object.keys(this.model).map(key => {
          return {
            key,
            value: this.model[key] || 'n/a',
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
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        // Lazily load input items
        fetch('https://api.publicapis.org/entries')
          .then(res => res.json())
          .then(res => {
            const { count, entries } = res
            this.count = count
            this.entries = entries
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
    },
  }
</script>