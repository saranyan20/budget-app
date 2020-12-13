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
                                <img
                                    src="cover.png"
                                    style="width: 16rem; height: 5rem"
                                />
                                <img
                                    src="login1.png"
                                    style="width: 24rem; height: 14rem"
                                />

                                <h3>Your Prescription for Savings</h3>
                            </CCardBody>
                        </CCard>
                        <CCard class="p-4">
                            <CCardBody>
                                <CForm>
                                    <div class="p-4">
                                        <h1>Login</h1>
                                        <p class="text-muted">
                                            Sign In to your account
                                        </p>
                                        <CInput
                                            placeholder="Email"
                                            autocomplete="email"
                                            prepend="@"
                                            :value.sync="
                                                $v.loginDetails.mail.$model
                                            "
                                            :lazy="false"
                                            :isValid="checkIfValid('mail')"
                                            invalidFeedback="This is a required field"
                                            class="email login-form-group"
                                        />
                                        <CInput
                                            placeholder="Password"
                                            type="password"
                                            autocomplete="curent-password"
                                            :value.sync="
                                                $v.loginDetails.password.$model
                                            "
                                            :lazy="false"
                                            :isValid="checkIfValid('password')"
                                            invalidFeedback="This is a required field"
                                            class="login-form-group"
                                        >
                                            <template #prepend-content>
                                                <CIcon name="cil-lock-locked" />
                                            </template>
                                        </CInput>
                                        <p
                                            :style="{
                                                color: 'red',
                                                textAlign: 'center',
                                            }"
                                        >
                                            {{ loginFeedback }}
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
                                            <CCol col="6" class="text-right">
                                                <CButton
                                                    color="link"
                                                    class="px-0"
                                                    >Forgot password?</CButton
                                                >
                                                <CButton
                                                    color="link"
                                                    class="d-lg-none"
                                                    >Register now!
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                        <p class="mt-3 text-muted">
                                            Don't have an account?
                                            <a href="#/pages/register"
                                                >Sign Up</a
                                            >
                                        </p>
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
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import gql from "graphql-tag";
import { storeData } from "../../store";

export default {
    name: "Login",
    data() {
        return {
            loginDetails: {
                mail: "",
                password: "",
            },
            loginFeedback: "",
        };
    },
    mixins: [validationMixin],
    validations: {
        loginDetails: {
            mail: {
                required,
                email,
            },
            password: {
                required,
            },
        },
    },
    methods: {
        checkIfValid(fieldName) {
            const field = this.$v.loginDetails[fieldName];
            if (!field.$dirty) {
                return null;
            }
            return !(field.$invalid || field.$model === "");
        },

        validate() {
            this.$v.$touch();
        },
        reset() {
            this.loginDetails = {
                mail: "",
                password: "",
            };
            this.approvePendingToasts = [];
            this.invalidUserToasts = [];
        },
        loginHandler() {
            this.$apollo
                .mutate({
                    // Query
                    mutation: gql`
                        query($mail: String!, $password: String!) {
                            spendmd_db_user(
                                where: {
                                    mail: { _eq: $mail }
                                    password: { _eq: $password }
                                }
                            ) {
                                id
                                name
                                mail
                                acct_status
                                role
                            }
                            spendmd_db_role {
                                name
                                id
                            }
                        }
                    `,
                    // Parameters
                    variables: this.loginDetails,
                })
                .then((res) => {
                    const result = res?.data?.spendmd_db_user;
                    const roleResult = res?.data?.spendmd_db_role;
                    console.log(res);
                    for (const el of result) {
                        roleResult.map((eachRole) => {
                            if (eachRole.id == el.role) el.role = eachRole.name;
                        });
                    }
                    console.log(result);
                    if (result.length && result[0].acct_status == "Approved") {
                        localStorage.setItem("user", result[0].name);
                        storeData.currentUserDetails = result[0];
                        this.$router.push("/dashboard");
                        console.log("valid user");
                    } else if (
                        result.length &&
                        result[0].acct_status == "Pending"
                    ) {
                        this.loginFeedback = "User approval pending!!";
                    } else if (
                        result.length &&
                        result[0].acct_status == "Rejected"
                    ) {
                        this.loginFeedback = "User rejected!!";
                    } else {
                        this.loginFeedback =
                            "Kindly check the Email ID and Password.";
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>

<style scoped>
.login-form-group {
    margin-bottom: 1rem !important;
}
</style>
