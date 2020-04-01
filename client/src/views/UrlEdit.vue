<template>
  <div class="col-md-12">
    <div class="container">
      <header class="jumbotron">
        <h3>Edit URL</h3>
      </header>
      <form name="form" @submit.prevent="handleRegister">
        <div v-if="!successful">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              v-model="url.title"
              type="text"
              class="form-control"
              name="title"
              value=url.title
            />
          </div>
          <div class="form-group">
            <label for="longurl">URL</label>
            <input
              v-model="url.longUrl"
              v-validate="'required|url'"
              type="text"
              class="form-control"
              name="longurl"
              value=url.longUrl
            />
            <div
              v-if="submitted && errors.has('longurl')"
              class="alert-danger"
            >{{errors.first('longurl')}}</div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary">Save</button>
          </div>
        </div>
      </form>

      <div
        v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
    </div>
  </div>
</template>

<script>
import Url from '../models/url';
import UserService from '../services/user.service';

export default {
  name: 'Register',
  data() {
    return {
      url: new Url('', '', ''),
      id: 0,
      stat:'',
      submitted: false,
      successful: false,
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
        this.url.title = response.data.title;
        this.url.longUrl = response.data.longURL;
      },
      error => {
        this.message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          UserService.editUrl(this.url, this.id).then(
            () => {
              /* this.content = response.data;
              this.$router.push('/profile'); */
              this.$router.push({ path: `/urls/${this.id}` })
            },
            error => {
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
        }
      });
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>