<template>
	<div>
		<CCard class="m-2">
			<CCardBody>
				<CRow>
					<CCol sm="1">
						<h5 class="my-2 float-right">Filters</h5>
					</CCol>
					<CCol sm="1">
						<CSelect
							:value.sync="selectedMonth"
							:options="getMonthOptions"
						/>
					</CCol>
					<CCol sm="1">
						<CSelect
							:value.sync="selectedYear"
							:options="getYearOptions"
						/>
					</CCol>
				</CRow>

				<CRow>
					<CCol sm="6" class="p-4">
						<IncomeList
							:selectedYear="selectedYear"
							:selectedMonth="selectedMonth"
						/>
					</CCol>
					<CCol sm="6" class="pl-0 py-4 pr-4">
						<ExpenseList
							:selectedYear="selectedYear"
							:selectedMonth="selectedMonth"
						/>
					</CCol>
				</CRow>
			</CCardBody>
		</CCard>
	</div>
</template>

<script>
import IncomeList from './components/IncomeList.vue';
import ExpenseList from './components/ExpenseList.vue';

export default {
	components: {
		IncomeList,
		ExpenseList
	},
	data() {
		return {
			selectedYear: null,
			selectedMonth: null
		};
	},
	computed: {
		getMonthOptions() {
			return this.$store.getters.getMonthOptions;
		},
		getYearOptions() {
			return this.$store.getters.getYearOptions;
		},
		defaultSelection() {
			let year = new Date().getFullYear();
			let month = new Date().getMonth() + 1;
			return { year, month };
		}
	},
	beforeMount() {
		this.selectedYear = this.defaultSelection.year;
		this.selectedMonth = this.defaultSelection.month;
	}
};
</script>

<style scoped>
</style>