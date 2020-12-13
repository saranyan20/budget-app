<template>
    <CCard>
        <CCardHeader><h5>Budget Dashboard</h5></CCardHeader>
        <CCardBody>
            <CRow>
                <CCol sm="6">
                    <CSelect
                        :value.sync="selectedYear"
                        :options="yearOptions"
                    />
                </CCol>
            </CRow>
            <br />
            <CCardGroup deck class="card-columns">
                <CCard style=" margin-right: 0;" class="custom-card">
                    <CCardHeader>Amount of expense by month</CCardHeader>
                    <CCardBody>
                        <CChartBar
                            style="height: 300px"
                            :key="1"
                            :datasets="expenseAmountByMonth"
                            labels="months"
                            :options="{ maintainAspectRatio: false }"
                        />
                    </CCardBody>
                </CCard>
                <CCard style="margin-right: 0;" class="custom-card">
                    <CCardHeader>Amount of expense by category</CCardHeader>
                    <CCardBody>
                        <CSelect
                            :value.sync="selectedMonth"
                            :options="monthOptions"
                        />
                        <br />
                        <CChartPie
                            style="height: 300px"
                            :key="1"
                            :datasets="expenseAmountByCategory"
                            :labels="expenseCategory"
                            :options="{ maintainAspectRatio: false }"
                        />
                    </CCardBody>
                </CCard>
            </CCardGroup>
        </CCardBody>
    </CCard>
</template>

<script>
import queries from './queries';

export default {
    data() {
        return {
            selectedYear: new Date().getFullYear(),
            selectedMonth: new Date().getMonth() + 1,

            expenseByMonth: [],
            expenseByCategory: [],
            expenseCategory: [],

            incomeCategoryOptions: [],
            expenseCategoryOptions: [],

            incomeList: [],
            expenseList: []
        };
    },
    computed: {
        yearOptions() {
            return [
                { label: '2020', value: 2020 },
                { label: '2021', value: 2021 },
                { label: '2022', value: 2022 },
                { label: '2023', value: 2023 },
                { label: '2024', value: 2024 },
                { label: '2025', value: 2025 }
            ];
        },
        monthOptions() {
            return [
                { label: 'January', value: 1 },
                { label: 'February', value: 2 },
                { label: 'March', value: 3 },
                { label: 'April', value: 4 },
                { label: 'May', value: 5 },
                { label: 'June', value: 6 },
                { label: 'July', value: 7 },
                { label: 'August', value: 8 },
                { label: 'September', value: 9 },
                { label: 'October', value: 10 },
                { label: 'November', value: 11 },
                { label: 'December', value: 12 }
            ];
        },
        expenseAmountByMonth() {
            return [
                {
                    data: this.expenseByMonth,
                    backgroundColor: '#E55353',
                    label: 'Amount'
                }
            ];
        },
        expenseAmountByCategory() {
            return [
                {
                    data: this.expenseByCategory,
                    backgroundColor: [
                        '#E55353',
                        '#41B883',
                        '#E46651',
                        '#00D8FF',
                        '#DD1B16'
                    ],
                    label: 'No of jobs'
                }
            ];
        }
    },
    watch: {
        selectedYear() {
            this.getExpenseByMonth();
            this.getExpenseByCategory();
        },
        selectedMonth() {
            this.getExpenseByMonth();
            this.getExpenseByCategory();
        }
    },
    methods: {
        getBudgetDetails() {
            this.$apollo
                .mutate({
                    mutation: queries.GET_BUDGET_DETAILS,
                    variables: { login_id: localStorage.getItem('login_id') }
                })
                .then(res => {
                    let incomeList = [],
                        expenseList = [];
                    const result = res?.data?.budget_app_budget_details;
                    if (result.length > 0) {
                        for (const el of result) {
                            if (el.type == 'Income') incomeList.push(el);
                            else if (el.type == 'Expense') expenseList.push(el);
                        }
                        this.incomeList = incomeList;
                        this.expenseList = expenseList;

                        this.getExpenseByMonth();
                        this.getExpenseByCategory();
                    }
                })
                .catch(err => console.log(err));
        },

        getExpenseByMonth() {
            const expenseByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (const el of this.expenseList) {
                const month = new Date(el.transaction_date).getMonth() + 1;
                const year = new Date(el.transaction_date).getFullYear();
                if (year == this.selectedYear) {
                    expenseByMonth[month - 1] += el.amount;
                }
            }
            this.expenseByMonth = expenseByMonth;
        },

        getExpenseByCategory() {
            const expenseByCategory = [],
                expenseCategory = [];
            for (const el of this.expenseList) {
                const month = new Date(el.transaction_date).getMonth() + 1;
                const year = new Date(el.transaction_date).getFullYear();
                if (year == this.selectedYear && month == this.selectedMonth) {
                    for (const eachCategory of this.expenseCategoryOptions) {
                        if (el.category == eachCategory) {
                            expenseByCategory.push(el.amount);
                            expenseCategory.push(el.category);
                        }
                    }
                }
            }
            this.expenseByCategory = expenseByCategory;
            this.expenseCategory = expenseCategory;
        }
    },
    apollo: {
        categoryData: {
            query: queries.GET_CATEGORIES,
            update: data => data,
            result({ data }) {
                this.update = false;
                let incomeCategoryOptions = [],
                    expenseCategoryOptions = [];
                for (const el of data?.budget_app_income_category) {
                    incomeCategoryOptions.push(el.category_name);
                }
                for (const el of data?.budget_app_expense_category) {
                    expenseCategoryOptions.push(el.category_name);
                }
                this.incomeCategoryOptions = incomeCategoryOptions;
                this.expenseCategoryOptions = expenseCategoryOptions;

                this.getBudgetDetails();
            }
        }
    }
};
</script>
