<template>
    <CSidebar
        :minimize="minimize"
        unfoldable
        :show="show"
        @update:show="value => $store.commit('set', ['sidebarShow', value])"
        colorScheme="warning"
    >
        <CSidebarBrand
            class="d-md-down-none"
            style="background-color: #006d40"
            to="/"
        >
            <!-- <CIcon 
        class="c-sidebar-brand-full" 
        name="logo" 
        size="custom-size"
        :height="35" 
        viewBox="0 0 556 134"
      /> -->
            <h3>Budget App</h3>
        </CSidebarBrand>
        <CRenderFunction flat :contentToRender="role" />
        <!-- <CSidebarMinimizer 
      class="c-d-md-down-none" 
      @click.native="$store.commit('toggle', 'sidebarMinimize')"
    /> -->
    </CSidebar>
</template>

<script>
import { admin } from './_nav';

export default {
    name: 'TheSidebar',
    admin,
    data() {
        return {
            count: this.$store.state.userCount
        };
    },
    computed: {
        show() {
            return this.$store.state.sidebarShow;
        },
        minimize() {
            return this.$store.state.sidebarMinimize;
        },
        role() {
            return this.$options.admin;
        }
    }
};
</script>
