<template>
    <div class="c-app" :class="{ 'c-dark-theme': $store.state.darkMode }">
        <TheSidebar v-if="!$route.path.includes('er/new')" />
        <TheAside />
        <CWrapper>
            <TheHeader v-if="!$route.path.includes('er/new')" />
            <div class="c-body">
                <main class="c-main">
                    <CContainer fluid>
                        <transition name="fade">
                            <router-view></router-view>
                        </transition>
                    </CContainer>
                </main>
            </div>
        </CWrapper>
    </div>
</template>

<script>
import TheSidebar from './TheSidebar';
import TheHeader from './TheHeader';
import TheAside from './TheAside';

export default {
    name: 'TheContainer',
    data() {
        return {
            data: []
        };
    },
    components: {
        TheSidebar,
        TheHeader,
        TheAside,
    },
    beforeMount() {
        window.onbeforeunload = function() {
            if(this.$route.path.includes('employer')) {
                window.setTimeout(function() {
                    window.location = '/employer/login';
                }, 0);
            }
            else if(this.$route.path.includes('training-partner')) {
                window.setTimeout(function() {
                    window.location = '/training-partner/login';
                }, 0);
            }
            window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser
        };
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.custom-fluid {
    padding-left: 0 !important;
}

.custom-main {
    padding-top: 0 !important;
}
</style>
