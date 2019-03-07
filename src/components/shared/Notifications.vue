<template>
    <div v-if="showToast" :class="class_name">
        {{message}}
    </div>
</template>

<script>

    import {NotificationService} from "../../services/local/notification.service";

    export default {
        name: "Notifications",

        data() {
            return {
                showToast: false,
                message: '',
                class_name: '',

            };
        },

        mounted() {
            NotificationService.subscribe(this.onNotificationChanged);
        },
        beforeDestroy() {
            NotificationService.unsubscribe(this.callback)
        },
        methods: {
            onNotificationChanged(notification) {
                if (notification.show_alert) {
                    this.$toasted.show(notification.message, {
                        duration: 3000,
                        className: notification.class_name
                    });
                }

                if (notification.show_toast) {
                    this.showToast = true;
                    this.message = notification.message;
                    this.class_name = notification.class_name;
                    setTimeout(() => this.showToast = false, 3000);
                }
            }
        }
    }

</script>

<style scoped>

</style>
