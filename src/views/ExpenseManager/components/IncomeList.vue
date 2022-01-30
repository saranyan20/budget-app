<template>
	<CCard>
		<CCardHeader>
			<CRow>
				<CCol sm="11">
					<h5>Income</h5>
				</CCol>
				<CCol @click="addIncomeModal = true" style="cursor: pointer">
					<i
						style="font-size: 24px"
						class="fa fa-plus float-right"
					></i>
				</CCol>
			</CRow>
		</CCardHeader>
		<CCardBody>
			<CDataTable
				:items="incomeList"
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
					<td>{{ item.income_category.name }}</td>
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
							color="success"
							shape="pill"
							style="font-size: 1.2rem"
							>{{ parseAmount(totalIncome) }}</CBadge
						>
					</div>
				</CCol>
			</CRow>
		</CCardFooter>

		<AddIncomeModal
			:modal="addIncomeModal"
			:income="true"
			@close="addIncomeModal = false"
			@success="
				getIncomeList();
				addIncomeModal = false;
			"
		/>
	</CCard>
</template>

<script>
const fields = ['date', 'category', 'description', 'amount'];
import gql from 'graphql-tag';
import _ from '../../../utility';
import AddIncomeModal from './CrudModal.vue';

export default {
	components: {
		AddIncomeModal
	},
	props: {
		selectedYear: Number,
		selectedMonth: Number
	},
	watch: {
		selectedYear() {
			this.getIncomeList();
		},
		selectedMonth() {
			this.getIncomeList();
		}
	},
	data() {
		return {
			fields,
			incomeList: [],
			addIncomeModal: false,
			totalIncome: 0
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

		handleAddIncome() {},

		async getIncomeList() {
			let startDate = this.getStartDate();
			let endDate = this.getEndDate();

			try {
				const res = await this.$apollo.mutate({
					mutation: GET_INCOME_LIST,
					variables: {
						startDate,
						endDate
					}
				});

				const result =
					res?.data?.budget_app_income_list_aggregate?.nodes;
				this.totalIncome =
					res?.data?.budget_app_income_list_aggregate?.aggregate?.sum?.amount;

				if (result) {
					this.incomeList = [...result];
				}
			} catch (err) {
				console.log(err);
			}
		}
	},
	beforeMount() {
		this.getIncomeList();
	}
};

const GET_INCOME_LIST = gql`
	query incomeList($startDate: timestamp!, $endDate: timestamp!) {
		budget_app_income_list_aggregate(
			where: { date: { _gte: $startDate, _lte: $endDate } }
			order_by: { date: desc }
		) {
			nodes {
				date
				income_category {
					name
				}
				income_category_id
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