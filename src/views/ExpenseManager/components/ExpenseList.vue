<template>
	<CCard>
		<CCardHeader>
			<CRow>
				<CCol sm="6">
					<h5>Expense</h5>
				</CCol>
				<CCol @click="addExpenseModal = true" style="cursor: pointer">
					<i
						style="font-size: 24px"
						class="fa fa-plus float-right"
					></i>
				</CCol>
			</CRow>
		</CCardHeader>
		<CCardBody>
			<CDataTable
				:items="expenseList"
				:fields="fields"
				:column-filter="false"
				:items-per-page="5"
				:itemsPerPageSelect="true"
				hover
				sorter
				pagination
				responsive
				@filtered-items-change="setCurrentItems"
				style="min-height: 350px"
			>
				<template #category="{ item }">
					<td>{{ item.expense_category.name }}</td>
				</template>
				<template #amount="{ item }">
					<td>{{ parseAmount(item.amount) }}</td>
				</template>
				<template #date="{ item }">
					<td>{{ parseDate(item.date) }}</td>
				</template>
			</CDataTable>
		</CCardBody>
		<CCardFooter>
			<CRow>
				<CCol sm="8"></CCol>
				<CCol>
					<div class="float-right">
						<h5 class="mr-2 d-inline-block" style="color: #687286">
							Total:
						</h5>
						<CBadge
							color="danger"
							shape="pill"
							style="font-size: 1.2rem"
							>{{ parseAmount(totalExpense) }}</CBadge
						>
					</div>
				</CCol>
			</CRow>
		</CCardFooter>

		<AddExpenseModal
			:modal="addExpenseModal"
			:income="false"
			@close="addExpenseModal = false"
			@success="
				getExpenseList();
				addExpenseModal = false;
			"
		/>
	</CCard>
</template>

<script>
const fields = ['date', 'category', 'description', 'amount'];
import gql from 'graphql-tag';
import _ from '../../../utility';
import AddExpenseModal from './CrudModal.vue';

export default {
	components: {
		AddExpenseModal
	},
	props: {
		selectedYear: Number,
		selectedMonth: Number
	},
	watch: {
		selectedYear() {
			this.getExpenseList();
		},
		selectedMonth() {
			this.getExpenseList();
		}
	},
	data() {
		return {
			fields,
			expenseList: [],
			addExpenseModal: false,
			totalExpense: 0
		};
	},
	methods: {
		setCurrentItems(val) {
			this.currentItems = val;
		},

		parseAmount(amount) {
			return _.parseAmountToINR(amount);
		},
		parseDate(date) {
			return _.parseDate(date);
		},

		getStartDate() {
			let date = `01`;
			let month = this.selectedMonth;
			let year = this.selectedYear;

			if (month < 10) month = `0${month}`;
			return `${year}-${month}-${date}`;
		},

		getEndDate() {
			let month = this.selectedMonth;
			let year = this.selectedYear;
			let date = new Date(year, month, 0).getDate(); // get last day of the month

			if (month < 10) month = `0${month}`;
			if (date < 10) date = `0${date}`;

			return `${year}-${month}-${date}`;
		},

		async getExpenseList() {
			let startDate = this.getStartDate();
			let endDate = this.getEndDate();

			try {
				const res = await this.$apollo.mutate({
					mutation: GET_EXPENSE_LIST,
					variables: {
						startDate,
						endDate
					}
				});

				console.log(res);

				const result =
					res?.data?.budget_app_expense_list_aggregate?.nodes;
				this.totalExpense =
					res?.data?.budget_app_expense_list_aggregate?.aggregate?.sum
						?.amount || 0;

				console.log(result);
				if (result) {
					this.expenseList = [...result];
					console.log(this.expenseList);
				}
			} catch (err) {
				console.log(err);
			}
		}
	},
	beforeMount() {
		this.getExpenseList();
	}
};

const GET_EXPENSE_LIST = gql`
	query expenseList($startDate: timestamp!, $endDate: timestamp!) {
		budget_app_expense_list_aggregate(
			where: { date: { _gte: $startDate, _lte: $endDate } }
			order_by: { date: desc }
		) {
			nodes {
				date
				expense_category {
					name
				}
				expense_category_id
				description
				amount
				id
			}
			aggregate {
				sum {
					amount
				}
			}
		}
	}
`;
</script>

<style scoped>
</style>