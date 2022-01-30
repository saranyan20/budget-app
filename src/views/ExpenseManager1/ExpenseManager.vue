<template>
	<CCard>
		<CCardHeader><h5>Budget Manager</h5></CCardHeader>
		<CCardBody>
			<CRow>
				<CCol sm="1"> Filter: </CCol>
				<CCol sm="3">
					<CSelect
						placeholder="Select a year"
						:value.sync="selectedYear"
						:options="yearOptions"
					/>
				</CCol>
				<CCol sm="3">
					<CSelect
						placeholder="Select a month"
						:value.sync="selectedMonth"
						:options="monthOptions"
					/>
				</CCol>
				<CCol sm="1">
					<CButton @click="applyFilter" color="secondary"
						>Apply</CButton
					>
				</CCol>
				<CCol sm="1">
					<CButton @click="clearFilter" color="dark">Clear</CButton>
				</CCol>
			</CRow>
			<CRow>
				<CCol col="12" sm="6">
					<CWidgetProgressIcon
						:header="`${getIndianFormat(totalBalance)}`"
						text="Available Balance"
						color="info"
						:value="(totalBalance / totalIncome) * 100"
					>
					</CWidgetProgressIcon>
				</CCol>
				<CCol col="12" sm="6">
					<CWidgetProgressIcon
						:header="`${getIndianFormat(totalSavings)}`"
						text="Total Savings"
						color="info"
						:value="(totalBalance / totalIncome) * 100"
					>
					</CWidgetProgressIcon>
				</CCol>
			</CRow>

			<CRow>
				<CCol>
					<CCard>
						<CCardHeader>
							<h4 style="display: inline-block">Income List</h4>
							<CButton
								color="success"
								style="float: right"
								@click="addItem('Income')"
								>Add Income</CButton
							>
							<CCallout color="success">
								<h6 class="text-muted">Total Income</h6>
								<strong class="h4"
									>₹
									{{ getIndianFormat(totalIncome) }}</strong
								>
							</CCallout>
						</CCardHeader>
						<CCardBody>
							<CDataTable
								:items="filteredIncomeList"
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
								<template #action="{ item }">
									<td class="py-0">
										<CButton
											color="secondary"
											square
											size="sm"
											class="m-1"
											v-c-tooltip="{
												content:
													'<strong>View</strong>',
												placement: 'bottom'
											}"
											@click="viewBudgetDetails(item)"
										>
											<CIcon name="cil-file" />
										</CButton>
									</td>
								</template>
							</CDataTable>
						</CCardBody>
					</CCard>
				</CCol>

				<CCol>
					<CCard>
						<CCardHeader>
							<h4 style="display: inline-block">Expense List</h4>
							<CButton
								color="danger"
								style="float: right"
								@click="addItem('Expense')"
								>Add Expense</CButton
							>
							<CCallout color="danger">
								<h6 class="text-muted">Total Expense</h6>
								<strong class="h4"
									>₹
									{{ getIndianFormat(totalExpense) }}</strong
								>
							</CCallout>
						</CCardHeader>
						<CCardBody>
							<CDataTable
								:items="filteredExpenseList"
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
								<template #action="{ item }">
									<td class="py-0">
										<CButton
											color="secondary"
											square
											size="sm"
											class="m-1"
											v-c-tooltip="{
												content:
													'<strong>View</strong>',
												placement: 'bottom'
											}"
											@click="viewBudgetDetails(item)"
										>
											<CIcon name="cil-file" />
										</CButton>
									</td>
								</template>
							</CDataTable>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>
		</CCardBody>
		<CModal
			:title="budget.type"
			:show.sync="modal"
			class="disable-footer"
			centered
			fade
		>
			<CForm>
				<CSelect
					horizontal
					label="Category"
					:lazy="false"
					:value.sync="budget.category"
					:options="
						budget.type == 'Income'
							? incomeCategoryOptions
							: expenseCategoryOptions
					"
					placeholder="Please select a category"
					:disabled="view"
				/>
				<CInput
					horizontal
					label="Description"
					:lazy="false"
					:value.sync="budget.description"
					:disabled="view"
				/>
				<CInput
					horizontal
					label="Amount"
					:lazy="false"
					:value.sync="budget.amount"
					prepend="₹"
					:disabled="view"
				/>
			</CForm>
			<br />
			<div class="inactive-modal-response" style="float: right">
				<CButton
					type="submit"
					color="primary"
					class="m-1"
					@click="insertBudgetDetails"
					>Submit</CButton
				>
				<CButton
					type="submit"
					color="secondary"
					class="m-1"
					@click="modal = false"
					>Cancel</CButton
				>
			</div>
		</CModal>
	</CCard>
</template>

<script>
import queries from './queries';

let fields = [
	{ key: 'transaction_date' },
	{ key: 'amount' },
	{ key: 'category' },
	{
		key: 'action',
		label: 'Action',
		sorter: false,
		filter: false
	}
];

export default {
	data() {
		return {
			fields,
			currentItems: [],
			selectedYear: new Date().getFullYear(),
			selectedMonth: new Date().getMonth() + 1,

			modal: false,
			type: '',
			budget: this.getEmptyForm(),
			view: false,
			render: true,

			incomeCategoryOptions: [],
			expenseCategoryOptions: [],
			incomeList: [],
			expenseList: [],
			filteredIncomeList: [],
			filteredExpenseList: [],

			totalBalance: 0,
			totalIncome: 0,
			totalExpense: 0,
			totalSavings: 0,

			insertSavings: false
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
		}
	},

	methods: {
		getEmptyForm() {
			return {
				amount: 0,
				category: '',
				description: '',
				type: ''
			};
		},

		reset() {
			this.budget = this.getEmptyForm();
		},

		setCurrentItems(val) {
			this.currentItems = val;
		},

		addItem(type) {
			this.reset();
			this.modal = true;
			this.budget.type = type;
			this.view = false;
		},

		getIndianFormat(amount) {
			if (amount != '') {
				amount = amount.toString();
				var lastThree = amount.substring(amount.length - 3);
				var otherNumbers = amount.substring(0, amount.length - 3);
				if (otherNumbers != '') lastThree = ',' + lastThree;
				var res =
					otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
					lastThree;
				return res;
			}
			return 0;
		},

		getBudgetDetails() {
			return new Promise((resolve, reject) => {
				this.$apollo
					.mutate({
						mutation: queries.GET_BUDGET_DETAILS,
						variables: {
							login_id: localStorage.getItem('login_id')
						}
					})
					.then((res) => {
						let incomeList = [],
							expenseList = [];
						const result = res?.data?.budget_app_budget_details;
						if (result.length > 0) {
							for (const el of result) {
								if (el.type == 'Income') incomeList.push(el);
								else if (el.type == 'Expense')
									expenseList.push(el);
							}
							this.incomeList = incomeList;
							this.expenseList = expenseList;

							this.filteredIncomeList = this.incomeList;
							this.filteredExpenseList = this.expenseList;

							this.getBudgetAmount(
								'Income',
								this.filteredIncomeList
							);
							this.getBudgetAmount(
								'Expense',
								this.filteredExpenseList
							);
							this.applyFilter();

							resolve();
						}
					})
					.catch((err) => {
						console.log(err);
						reject();
					});
			});
		},

		getBudgetAmount(type, list) {
			let total = 0;

			for (const el of list) {
				total += el.amount;
			}

			if (type == 'Income') {
				this.totalIncome = total;
			} else if (type == 'Expense') {
				this.totalExpense = total;
			}

			this.totalBalance = this.totalIncome - this.totalExpense;
		},

		getTotalSavings() {
			this.$apollo
				.mutate({
					mutation: queries.GET_MONTHLY_SAVINGS,
					variables: { login_id: localStorage.getItem('login_id') }
				})
				.then((res) => {
					const result =
						res?.data?.budget_app_monthly_savings_aggregate
							?.aggregate?.sum;
					if (result.amount > 0) {
						this.totalSavings = result.amount;
					}
				});
		},

		insertBudgetDetails() {
			this.$apollo
				.mutate({
					mutation: queries.INSERT_BUDGET_DETAILS,
					variables: {
						...this.budget,
						login_id: localStorage.getItem('login_id')
					}
				})
				.then((res) => {
					const result =
						res?.data?.insert_budget_app_budget_details?.returning;
					if (result[0].id > 0) {
						this.getBudgetDetails();
						this.getBudgetAmount('Income', this.filteredIncomeList);
						this.getBudgetAmount(
							'Expense',
							this.filteredExpenseList
						);
						this.modal = false;
					}
				})
				.catch((err) => console.log(err));
		},

		// Insert previous month saving to db on every 1st of month
		insertEachMonthSavings() {
			console.log('entered');
			this.$apollo
				.mutate({
					mutation: queries.INSERT_MONTHLY_SAVINGS,
					variables: {
						login_id: localStorage.getItem('login_id'),
						amount: this.totalBalance
					}
				})
				.then((res) => {
					const result =
						res?.data?.insert_budget_app_monthly_savings?.returning;
					console.log(result);
					if (result[0].id > 0) {
						this.insertSavings = false;
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		viewBudgetDetails(item) {
			this.view = true;
			this.budget = { ...item };
			this.modal = true;
		},

		applyFilter() {
			if (this.selectedYear != '' || this.selectedMonth != '') {
				this.filteredIncomeList = this.incomeList;
				this.filteredExpenseList = this.expenseList;

				if (this.selectedMonth != '') {
					this.filteredExpenseList = this.filteredExpenseList.filter(
						(el) =>
							new Date(el.transaction_date).getMonth() + 1 ==
							this.selectedMonth
					);
					this.filteredIncomeList = this.filteredIncomeList.filter(
						(el) => {
							return (
								new Date(el.transaction_date).getMonth() + 1 ==
								this.selectedMonth
							);
						}
					);
					this.getBudgetAmount('Expense', this.filteredExpenseList);
					this.getBudgetAmount('Income', this.filteredIncomeList);
				}
				if (this.selectedYear != '') {
					this.filteredExpenseList = this.filteredExpenseList.filter(
						(el) =>
							new Date(el.transaction_date).getFullYear() ==
							this.selectedYear
					);
					this.filteredIncomeList = this.filteredIncomeList.filter(
						(el) =>
							new Date(el.transaction_date).getFullYear() ==
							this.selectedYear
					);
					this.getBudgetAmount('Expense', this.filteredExpenseList);
					this.getBudgetAmount('Income', this.filteredIncomeList);
				}
			}
		},

		clearFilter() {
			this.selectedYear = new Date().getFullYear();
			this.selectedMonth = new Date().getMonth() + 1;
			this.filteredExpenseList = this.expenseList;
			this.filteredIncomeList = this.incomeList;
			this.getBudgetAmount('Expense', this.filteredExpenseList);
			this.getBudgetAmount('Income', this.filteredIncomeList);
		}
	},
	apollo: {
		categoryData: {
			query: queries.GET_CATEGORIES,
			update: (data) => data,
			result({ data }) {
				this.update = false;
				let incomeCategoryOptions = [],
					expenseCategoryOptions = [];
				for (const el of data?.budget_app_income_category) {
					incomeCategoryOptions.push({
						label: el.category_name,
						value: el.category_name
					});
				}
				for (const el of data?.budget_app_expense_category) {
					expenseCategoryOptions.push({
						label: el.category_name,
						value: el.category_name
					});
				}
				this.incomeCategoryOptions = incomeCategoryOptions;
				this.expenseCategoryOptions = expenseCategoryOptions;

				this.getBudgetDetails();
				this.getTotalSavings();
			}
		}
	}
};
</script>
