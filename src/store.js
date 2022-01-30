import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    sidebarShow: 'responsive',
    sidebarMinimize: true,
    asideShow: false,
    darkMode: false,
    role: 'Employer',
    userCount: 5,
    hideOnMobileClick: true,
    monthOptions: [
        { label: 'Jan', value: 1 },
        { label: 'Feb', value: 2 },
        { label: 'Mar', value: 3 },
        { label: 'Apr', value: 4 },
        { label: 'May', value: 5 },
        { label: 'Jun', value: 6 },
        { label: 'Jul', value: 7 },
        { label: 'Aug', value: 8 },
        { label: 'Sep', value: 9 },
        { label: 'Oct', value: 10 },
        { label: 'Nov', value: 11 },
        { label: 'Dec', value: 12 }
    ],
    yearOptions: [],
    incomeCategoryOptions: [],
    expenseCategoryOptions: []
};

export const storeData = Vue.observable({});

const mutations = {
    toggleSidebarDesktop(state) {
        const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow);
        state.sidebarShow = sidebarOpened ? false : 'responsive';
    },
    toggleSidebarMobile(state) {
        const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow);
        state.sidebarShow = sidebarClosed ? true : 'responsive';
    },
    set(state, [variable, value]) {
        state[variable] = value;
    },
    toggle(state, variable) {
        state[variable] = !state[variable];
    }
};

const getters = {
    getMonthOptions: state => state.monthOptions,
    getYearOptions: state => {
        const startYear = 2022;
        const endYear = new Date().getFullYear();

        const yearOptions = [];
        for (let i = startYear; i <= endYear; i++) {
            yearOptions.push({ label: i, value: i });
        }
        return yearOptions;
    },
    getIncomeCategoryOptions: state => state.incomeCategoryOptions,
    getExpenseCategoryOptions: state => state.expenseCategoryOptions
};

export default new Vuex.Store({
    state,
    getters,
    mutations
});
