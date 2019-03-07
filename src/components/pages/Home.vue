<template>
    <div class="container">

        <!-- <app-carousel :items="carouselItems"></app-carousel> -->
         <app-carousel :items="this.tagsAndCategories"></app-carousel>
        <div class="container" style="margin-top: '100px'">
            <div class="row">
                <div class="col-lg-12">
                    <div class="row">
                        <template v-if="this.tagsAndCategories.length > 0">
                            <div v-for="(item, index) in this.tagsAndCategories" class="col-lg-4 col-md-6 mb-4"
                                 :key="index"
                                 :id="item.id">
                                <div class="card h-100">
                                    <a :href="`/tags/${item.slug}`">
                                        <img class="card-img-top" style="height: '250px'"
                                             :src="[item.image_urls instanceof Array && item.image_urls.length > 0 ? item.image_urls[0] : 'https://img.business.com/rc/816x500/aHR0cHM6Ly93d3cuYnVzaW5lc3NuZXdzZGFpbHkuY29tL2ltYWdlcy9pLzAwMC8wMTcvMDg0L29yaWdpbmFsL21hY2Jvb2stcHJvLTE4LnBuZw==?_ga=2.200130154.557404650.1551883694-765115885.155188369']"
                                             alt=""/>
                                    </a>
                                    <div class="card-body">
                                        <h4 class="card-title">
                                            <router-link v-bind:to="'/tags/' + item.slug">
                                                {{item.name}}
                                            </router-link>
                                        </h4>
                                        <p class="card-text">{{item.description}}</p>
                                    </div>
                                    <div class="card-footer">
                                        <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small>
                                        <router-link class="btn btn-primary" style="float: 'right'"
                                                     :to="'/tags/' + item.slug">
                                            Show More
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="isLoading">
                            Loading ....
                        </template>
                        <template v-else-if="isError">
                            Error ... try refreshing or fix the problem
                        </template>
                        <template v-else>
                            No tags, neither categories available
                        </template>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>

    import {NotificationService} from "@/services/local/notification.service";
    import {PagesAxiosService} from "@/services/remote/pages.axios.service";
    import AppCarousel from "@/components/shared/AppCarousel";

    export default {
        name: "Home",
        data() {
            return {
                isLoading: false,
                isError: false,
                "tags": [],
                "categories": [],
                'carouselItems': [],
                'tagsAndCategories': []
            };
        },
        components: {
            AppCarousel,
        },

        mounted() {
            this.isLoading = true;
            return PagesAxiosService.fetchHome().then((data) => {
                this.isLoading = false;
                if (data.success) {
                    this.tags = data.tags;
                    this.categories = data.categories;
                    this.tagsAndCategories = data.tags.concat(data.categories);
                    const tagsCount = data.tags.length;
                    this.tagsAndCategories.forEach((item, index) => {
                        if (index === 0 || index === tagsCount) {
                            // first tag and first category
                            this.carouselItems.push({
                                id: item.id,
                                name: item.name,
                                slug: item.slug,
                                description: item.description,
                                image: item.image_urls[0]
                            });
                        }
                    });
                }
            }).catch(err => {
                this.isLoading = false;
                this.isError = true;
            });
        },
        methods: {},
    }

</script>

<style scoped>

</style>
