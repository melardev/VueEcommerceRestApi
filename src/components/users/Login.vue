<template>
    <div class="row">
        <div class="col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1">
            <form id="login-form" role="form" style="display: block;">
                <h3 class="text-center">Login</h3>
                <div class="form-group">
                    <input type="email" name="username" id="username" class="form-control" placeholder="Email Address"
                           v-model="username">
                </div>
                <div class="form-group">
                    <input type="password" name="password" id="password" class="form-control" placeholder="Password"
                           v-model="password">
                </div>

                <div class="form-group">
                    <button class="btn btn-success" style="width: 100%" @click.prevent="submitLoginForm"
                            :disabled="isLoading">
                        <i v-if="isLoading" class="fa fa-spinner fa-spin"></i>
                        Log in
                    </button>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="text-center">
                                <router-link to="/register"><a>Register</a></router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>

    import {UsersService} from "@/services/local/users.service";

    export default {
        data() {
            return {
                username: '',
                password: '',
                isLoading: false
            }
        },
        methods: {
            submitLoginForm() {
                this.isLoading = true;
                let credentials = {
                    username: this.username,
                    password: this.password
                };
                UsersService.login(credentials)
                    .then((data) => {
                        this.isLoading = false;
                        if (data.success) {
                            this.$router.push('/');
                        }
                    })
                    .catch(error => {
                        this.isLoading = false;
                    });
            },

        }
    }
</script>
