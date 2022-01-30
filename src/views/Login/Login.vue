<template>
	<div class="c-app flex-row align-items-center">
		<CContainer>
			<CRow class="justify-content-center">
				<CCol md="12">
					<CCardGroup>
						<CCard
							color="primary"
							text-color="white"
							class="text-center d-md-down-none"
							body-wrapper
						>
							<CCardBody>
								<br /><br /><br /><br /><br /><br />
								<h1>Budget App</h1>
							</CCardBody>
						</CCard>
						<CCard class="p-4">
							<CCardBody>
								<CForm>
									<div class="p-4">
										<h2>Login</h2>
										<br />
										<CInput
											placeholder="User Name"
											autocomplete="email"
											prepend="@"
											:value.sync="
												$v.loginDetails.userName.$model
											"
											:lazy="false"
											:isValid="checkIfValid('userName')"
											invalidFeedback="This is a required field"
											class="email login-form-group"
											@keyup.enter="loginHandler"
											addLabelClasses="required"
										/>
										<CInput
											placeholder="Password"
											type="password"
											autocomplete="current-password"
											:value.sync="
												$v.loginDetails.password.$model
											"
											:lazy="false"
											:isValid="checkIfValid('password')"
											invalidFeedback="This is a required field"
											class="login-form-group"
											@keyup.enter="loginHandler"
											addLabelClasses="required"
										>
											<template #prepend-content>
												<CIcon name="cil-lock-locked" />
											</template>
										</CInput>
										<p
											style="
												color: red;
												text-align: center;
											"
										>
											{{ errorText }}
										</p>
										<CRow>
											<CCol col="6" class="text-left">
												<CButton
													color="primary"
													@click="loginHandler"
													class="px-4"
													>Login
												</CButton>
											</CCol>
										</CRow>
									</div>
								</CForm>
							</CCardBody>
						</CCard>
					</CCardGroup>
				</CCol>
			</CRow>
		</CContainer>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import queries from './Queries';
import { storeData } from '../../store';

export default {
	name: 'Login',
	data() {
		return {
			loginDetails: {
				userName: '',
				password: ''
			},
			errorText: '',
			role: ''
		};
	},
	mixins: [validationMixin],
	validations: {
		loginDetails: {
			userName: { required },
			password: { required, minLength: minLength(8) }
		}
	},
	methods: {
		checkIfValid(fieldName) {
			const field = this.$v.loginDetails[fieldName];
			if (!field.$dirty) {
				return null;
			}
			return !(field.$invalid || field.$model === '');
		},

		validate() {
			this.$v.$touch();
		},

		reset() {
			this.loginDetails = {
				userName: '',
				password: ''
			};
		},
		async loginHandler() {
			try {
				const res = await this.$apollo.mutate({
					mutation: queries.CHECK_LOGIN,
					variables: this.loginDetails
				});
				let result = res?.data?.budget_app_login;
				console.log(result);
				if (result[0].id) {
					localStorage.setItem('login_id', result[0].id);
					this.$router.push('expense-manager');
				}
			} catch (err) {
				console.log(err);
			}
		}
	}
};
</script>

<style scoped>
.login-form-group {
	margin-bottom: 1rem !important;
}
</style>
