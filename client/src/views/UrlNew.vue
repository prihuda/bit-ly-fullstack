<template>
  <div class="col-md-12">
    <div class="container">
      <header class="jumbotron">
        <h3>Add New URL</h3>
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
            />
            <div
              v-if="submitted && errors.has('longurl')"
              class="alert-danger"
            >{{errors.first('longurl')}}</div>
          </div>
          <div class="form-group">
            <label for="shorturl">Short URL</label>
            <input
              v-model="url.shortUrl"
              v-validate="'required|min:1|max:6'"
              type="text"
              class="form-control"
              name="shorturl"
              value=url.shortUrl
            />
            <div
              v-if="submitted && errors.has('shorturl')"
              class="alert-danger"
            >{{errors.first('shorturl')}}</div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary">Submit</button>
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
      submitted: false,
      successful: false,
      message: ''
    };
  },
  async beforeMount() {
    try {
      let response = await UserService.getShortUrl();
      this.url.shortUrl = response.data;
    }
    catch(error) {
      this.message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
    }
  },
  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          UserService.addUrl(this.url).then(
            response => {
              /* this.content = response.data;
              this.$router.push('/profile'); */
              this.$router.push({ path: `/urls/${response.data.shortUrl}` })
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