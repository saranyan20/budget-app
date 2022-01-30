import 'core-js/stable';
import Vue from 'vue';
import CoreuiVue from '@coreui/vue';
import App from './App';
import router from './router/index';
import { iconsSet as icons } from './assets/icons/icons.js';
import store from './store';
// import AuthPlugin from './plugins/auth';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';
import VModal from 'vue-js-modal';
import QuickEdit from 'vue-quick-edit';
import VueCompositionApi from '@vue/composition-api';
import CoreuiVueCharts from '@coreui/vue-chartjs';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import VueAxios from 'vue-axios';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

export const eventBus = new Vue();

library.add(faUserSecret);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.component('quick-edit', QuickEdit);
Vue.use(CoreuiVueCharts);
Vue.use(VueCompositionApi);
Vue.use(CoreuiVue);
Vue.use(VueApollo);
Vue.use(VModal);
Vue.use(VueQuillEditor);
Vue.prototype.$log = console.log.bind(console);
Vue.use(VueAxios, axios);
// Vue.use(AuthPlugin);

Vue.config.productionTip = false;

const link = createHttpLink({
    uri: 'https://budget-app.hasura.app/v1/graphql',
    fetch
});

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
        addTypename: true
    })
});

const apolloProvider = new VueApollo({
    defaultClient: client
});

new Vue({
    el: '#app',
    router,
    store,
    client,
    apolloProvider,
    //CIcon component documentation: https://coreui.io/vue/docs/components/icon
    icons,
    template: '<App/>',
    components: {
        App
    }
});
