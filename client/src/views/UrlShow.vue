<template>
  <div v-if="created" class="container">
    <header class="jumbotron">
      <p class="top-date">CREATED {{stat.date}}</p>
      <h3>
        <strong>{{stat.title}}</strong>
      </h3>
      <p>{{stat.longURL}}</p>
      <p><a v-bind:href="url" target="_blank">{{url.slice(7)}}</a></p>
    </header>
    <p>
      Total Clickthroughs: {{stat.clickthroughs}}
    </p>
    <p>
      Unique Visitors: {{stat.uniqueClickthroughs}}
    </p>
    <div style="text-align:right">
      <v-md-date-range-picker
      opens="left"
      :start-date="startdate"
      :end-date="enddate"
      @change="handleChange"
      ></v-md-date-range-picker>
      <button v-on:click="filter" class="btn btn-primary">Filter</button>
    </div>
    <table class="table table-condensed">
      <thead>
        <tr>
          <th>No.</th>
          <th>IP Address</th>
          <th>Referrer URL</th>
          <th>Date Visited</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in stat.visitors" :key="item.id">
          <td>{{ idx + 1 }}</td>
          <td>{{ item.ip_address }}</td>
          <td>{{ item.referrer_url }}</td>
          <td>{{ Date(item.createdAt).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
    <div
        v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
  </div>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'url',
  data() {
    let d = new Date().toUTCString();
    return {
      id: 0,
      stat: '',
      url: '',
      values: [],
      created: false,
      startdate: d,
      enddate: d,
      message: ''
    };
  },
  created() {
    this.id = this.$route.params.id;
  },
  mounted() {
    UserService.getUrl(this.id).then(
      response => {
        this.stat = response.data;
        this.url = process.env.VUE_APP_ROOT_API+'u/'+this.stat.shortURL;
        this.created = true;
      },
      error => {
        if (error == 'Error: Request failed with status code 401') {
          this.$store.dispatch('auth/logout');
          this.$router.push('/');
        }
        else {
          this.message =
            (error.response && error.response.data) ||
            error.status ||
            error;
        }
      }
    );
  },
  methods: {
    handleChange (values) {
      this.values = values
    },
    filter() {
      UserService.searchDate(this.id, this.values[0], this.values[1]).then(
        response => {
        this.stat.visitors = response.data;
      },
      error => {
        if (error == 'Error: Request failed with status code 401') {
          this.$store.dispatch('auth/logout');
          this.$router.push('/');
        }
        else {
          this.message =
            (error.response && error.response.data) ||
            error.status ||
            error;
        }
      }
      );
    }
  }
};
</script>

<style scoped>
.top-date {
  margin-bottom: 0;
}
</style>