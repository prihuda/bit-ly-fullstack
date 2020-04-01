<template>
  <div v-if="created" class="container">
    <header class="jumbotron">
      <h3>My URLs</h3>
    </header>
    <table class="table table-condensed">
      <thead>
					<tr>
						<th>No.</th>
						<th>Title</th>
						<th>URL</th>
            <th>Short URL</th>
            <th></th>
					</tr>
				</thead>
        <tbody>
          <tr v-for="(item, idx) in content" :key="item.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.url }}</td>
            <td>
              <a v-bind:href="url+'u/'+item.short_url" target="_blank">
                {{ item.short_url }}
              </a>
            </td>
            <td>
              <router-link :to="{ name: 'url', params: { id: item.short_url } }">
              <button type="submit" class="btn btn-primary">Statistics</button></router-link>

              <a v-bind:href="'/urls/'+item.short_url+'/edit'">
              <button type="submit" class="btn btn-primary">Edit</button></a>
            </td>
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
  name: 'User',
  data() {
    return {
      content: '',
      url: '',
      created: false,
      message: ''
    };
  },
  created() {
    UserService.getUrls().then(
      response => {
        this.content = response.data;
        this.url = process.env.VUE_APP_ROOT_API;
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
  }
};
</script>

<style scoped>
button {
  margin-left: 5px;
  margin-right: 5px;
}
</style>