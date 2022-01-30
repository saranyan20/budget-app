<template>
	<div class="c-app" :class="{ 'c-dark-theme': $store.state.darkMode }">
		<!-- <TheAside /> -->
		<TheSidebar />
		<CWrapper>
			<TheHeader />
			<div class="c-body">
				<main class="c-main">
					<CContainer fluid>
						<transition name="fade">
							<router-view></router-view>
						</transition>
					</CContainer>
				</main>
			</div>
		</CWrapper>
	</div>
</template>

<script>
import TheSidebar from './TheSidebar';
import TheHeader from './TheHeader';
import TheAside from './TheAside';
import gql from 'graphql-tag';

const GET_CATEGORIES = gql`
	query MyQuery {
		budget_app_income_category(order_by: { name: asc }) {
			name
			id
		}
		budget_app_expense_category(order_by: { name: asc }) {
			id
			name
		}
	}
`;

export default {
	name: 'TheContainer',
	data() {
		return {
			data: []
		};
	},
	components: {
		TheSidebar,
		TheHeader,
		TheAside
	},
	apollo: {
		categoryData: {
			query: GET_CATEGORIES,
			update: (data) => data,
			result({ data }) {
				this.update = false;
				let incomeCategoryOptions = [],
					expenseCategoryOptions = [];

				for (const el of data?.budget_app_income_category) {
					incomeCategoryOptions.push({
						label: el.name,
						value: el.id
					});
				}

				for (const el of data?.budget_app_expense_category) {
					expenseCategoryOptions.push({
						label: el.name,
						value: el.id
					});
				}

				this.$store.commit('set', [
					'incomeCategoryOptions',
					incomeCategoryOptions
				]);
				this.$store.commit('set', [
					'expenseCategoryOptions',
					expenseCategoryOptions
				]);
			}
		}
	}
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.custom-fluid {
	padding-left: 0 !important;
}

.custom-main {
	padding-top: 0 !important;
}
</style>
