import Vue from 'vue';
import Router from 'vue-router';

// Containers
const TheContainer = () => import('@/containers/TheContainer');

// Views - Pages
const Page404 = () => import('@/views/pages/Page404');
const Page500 = () => import('@/views/pages/Page500');

// Login
const Login = () => import('@/views/Login/Login');
const ExpenseManager = () => import('@/views/ExpenseManager/ExpenseManager');

// Dashboard
const Dashboard = () => import('@/views/Dashboard/Dashboard');

// Category
const IncomeCategory = () => import('@/views/Category/IncomeCategory');
const ExpenseCategory = () => import('@/views/Category/ExpenseCategory');

Vue.use(Router);

export default new Router({
    mode: 'history',
    linkActiveClass: 'open active',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
            path: '/',
            redirect: '/login',
            name: 'Login',
            component: {
                render(c) {
                    return c('router-view');
                }
            },
            children: [
                {
                    path: '404',
                    name: 'Page404',
                    component: Page404
                },
                {
                    path: '500',
                    name: 'Page500',
                    component: Page500
                },
                {
                    path: '/login',
                    name: 'Login',
                    component: Login
                }
            ]
        },
        {
            path: '/expense-manager',
            redirect: 'expense-managet',
            name: '',
            component: TheContainer,
            children: [
                {
                    path: '/expense-manager',
                    name: 'Budget Manager',
                    component: ExpenseManager
                },
                {
                    path: '/dashboard',
                    name: 'Budget Dashboard',
                    component: Dashboard
                },
                {
                    path: '/income-category',
                    name: 'Income Category',
                    component: IncomeCategory
                },
                {
                    path: '/expense-category',
                    name: 'Expense Category',
                    component: ExpenseCategory
                },

            ]
        }
    ]
});
