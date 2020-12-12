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

                                <h3>
                                    Register Today for Your Savings Prescription
                                </h3>
                            </CCardBody>
                        </CCard>
                        <CCard class="p-4">
                            <CCardBody>
                                <CForm>
                                    <div class="p-4">
                                        <h1>Register</h1>
                                        <p class="text-muted">
                                            Create your account
                                        </p>
                                        <CInput
                                            placeholder="Full Name"
                                            autocomplete="name"
                                            v-model="name"
                                            class="login-form-group"
                                        >
                                            <template #prepend-content>
                                                <CIcon name="cil-user" />
                                            </template>
                                        </CInput>
                                        <CInput
                                            placeholder="Email"
                                            autocomplete="mail"
                                            prepend="@"
                                            v-model="mail"
                                            class="email login-form-group"
                                        />
                                        <CInput
                                            placeholder="Password"
                                            type="password"
                                            autocomplete="new-password"
                                            v-model="password"
                                            class="login-form-group"
                                        >
                                            <template #prepend-content>
                                                <CIcon name="cil-lock-locked" />
                                            </template>
                                        </CInput>
                                        <CInput
                                            placeholder="Repeat password"
                                            type="password"
                                            autocomplete="new-password"
                                            class="login-form-group"
                                        >
                                            <template #prepend-content>
                                                <CIcon name="cil-lock-locked" />
                                            </template>
                                        </CInput>
                                        <CInput
                                            placeholder="Client / Hospital Name"
                                            type="text"
                                            v-model="hospitalName"
                                            class="login-form-group"
                                        >
                                            <template #prepend-content>
                                                <CIcon name="cil-drop" />
                                                <!-- <i class="cil-hospital"></i> -->
                                            </template>
                                        </CInput>
                                        <CButton
                                            color="primary"
                                            @click="register"
                                            >Create Account</CButton
                                        >
                                        <p class="mt-3 text-muted">
                                            Already have an account?
                                            <a href="#/pages/login">Log In</a>
                                        </p>
                                    </div>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCardGroup>
                </CCol>
            </CRow>
        </CContainer>
        <CModal
            title="User request"
            :show.sync="registerResponceModal"
            centered
            fade
            class="userAuthentication"
        >
            Thank you for registring. Our admin team will get in touch with you
            soon.
            <br />
        </CModal>
    </div>
</template>

<script>
import gql from "graphql-tag";

export default {
    name: "Register",
    data() {
        return {
            name: "",
            password: "",
            mail: "",
            hospitalName: "",
            toasts: [],
            registerResponceModal: false,
        };
    },
    methods: {
        register() {
            const login_time = new Date().toISOString();

            // Call to the graphql mutation
            this.$apollo
                .mutate({
                    // Query
                    mutation: gql`
                        mutation(
                            $mail: String!
                            $name: String!
                            $password: String!
                            $hospital_name: String!
                            $login_time: timestamptz!
                        ) {
                            insert_spendmd_db_user(
                                objects: {
                                    acct_status: "Pending"
                                    mail: $mail
                                    name: $name
                                    password: $password
                                    hospital_name: $hospital_name
                                    last_login: $login_time
                                    role: 2
                                }
                            ) {
                                returning {
                                    id
                                }
                            }
                        }
                    `,
                    // Parameters
                    variables: {
                        mail: this.mail,
                        name: this.name,
                        password: this.password,
                        hospital_name: this.hospitalName,
                        login_time,
                    },
                })
                .then((response) => {
                    // Result
                    console.log(response);
                    const result =
                        response?.data?.insert_spendmd_db_user?.returning;
                    if (result && result.length && result[0]?.id) {
                        this.registerResponceModal = true;
                        setTimeout(() => {
                            this.$router.push("/pages/login");
                        }, 3000);
                    }
                })
                .catch((error) => {
                    // Error
                    console.error(error);
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
