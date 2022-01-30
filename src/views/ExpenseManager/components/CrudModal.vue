<template>
	<CModal
		:title="`Add ${this.income ? 'Income' : 'Expense'}`"
		:show.sync="enableModal"
		class="disable-footer px-4"
		centered
		fade
		:close-on-backdrop="false"
	>
		<CForm>
			<CSelect
				label="Category"
				:lazy="false"
				:value.sync="$v.transaction.category.$model"
				:options="
					income
						? getIncomeCategoryOptions
						: getExpenseCategoryOptions
				"
				placeholder="Please select a category"
				:isValid="checkIfValid('category')"
			/>
			<CInput
				type="number"
				label="Amount"
				:lazy="false"
				:value.sync="$v.transaction.amount.$model"
				prepend="₹"
				:isValid="checkIfValid('amount')"
			/>
			<CTextarea
				label="Description"
				:lazy="false"
				:value.sync="$v.transaction.description.$model"
				:isValid="checkIfValid('description')"
			/>
		</CForm>
		<br />
		<div class="inactive-modal-response" style="float: right">
			<CButton
				type="submit"
				color="secondary"
				class="m-1"
				@click="handleCloseModal"
				>Cancel</CButton
			>
			<CButton
				type="submit"
				color="primary"
				class="ml-1"
				@click="handleSubmitTransaction"
				>Submit</CButton
			>
		</div>
	</CModal>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, numeric } from 'vuelidate/lib/validators';
import gql from 'graphql-tag';

export default {
	props: {
		income: Boolean,
		modal: Boolean
	},
	data() {
		return {
			transaction: this.getEmptyForm(),
			enableModal: false
		};
	},
	watch: {
		modal() {
			this.enableModal = this.modal;
		}
	},
	computed: {
		getIncomeCategoryOptions() {
			return this.$store.getters.getIncomeCategoryOptions;
		},
		getExpenseCategoryOptions() {
			return this.$store.getters.getExpenseCategoryOptions;
		}
	},
	mixins: [validationMixin],
	validations: {
		transaction: {
			category: {
				required
			},
			description: {
				required
			},
			amount: {
				required,
				numeric
			}
		}
	},
	methods: {
		getEmptyForm() {
			return {
				category: null,
				description: null,
				amount: null
			};
		},
		handleCloseModal() {
			this.enableModal = false;
			this.$emit('close');
		},
		checkIfValid(fieldName) {
			const field = this.$v.transaction[fieldName];
			if (!field.$dirty) {
				return null;
			}
			return !(field.$invalid || field.$model === '');
		},
		async handleSubmitTransaction() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				const res = await this.$apollo.mutate({
					mutation: this.income ? ADD_INCOME : ADD_EXPENSE,
					variables: {
						...this.transaction
					}
				});
				console.log(res);
				let result =
					res?.data?.insert_budget_app_expense_list?.returning[0];
				if (this.income)
					result =
						res?.data?.insert_budget_app_income_list?.returning[0];

				if (result.id) {
					this.$emit('success');
					this.enableModal = false;
				}
			}
		}
	}
};

const ADD_INCOME = gql`
	mutation ($amount: numeric!, $description: String!, $category: Int!) {
		insert_budget_app_income_list(
			objects: {
				amount: $amount
				description: $description
				income_category_id: $category
			}
		) {
			returning {
				id
			}
		}
	}
`;

const ADD_EXPENSE = gql`
	mutation ($amount: numeric!, $description: String!, $category: Int!) {
		insert_budget_app_expense_list(
			objects: {
				amount: $amount
				description: $description
				expense_category_id: $category
			}
		) {
			returning {
				id
			}
		}
	}
`;
</script>

<style scoped>
</style>