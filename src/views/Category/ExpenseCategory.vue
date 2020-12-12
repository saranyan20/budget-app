<template>
    <CRow>
        <CCol sm="12">
            <CCard>
                <CCardHeader>
                    <CRow>
                        <CCol class="mt-3">
                            <h5>Expense Category</h5>
                        </CCol>
                        <CCol sm="9" :style="{ textAlign: 'right' }">
                            <CButton
                                color="primary"
                                @click="
                                    addModal = !addModal;
                                    update = false;
                                    reset();
                                "
                                >Add Category</CButton
                            >
                        </CCol>
                        <CModal
                            :title="update ? 'Edit Category' : 'Add Category'"
                            :show.sync="addModal"
                            centered
                            class="addCategoryModal"
                            fade
                        >
                            <CInput
                                horizontal
                                label="Category"
                                :lazy="false"
                                :value.sync="
                                    $v.expenseCategory.category_name.$model
                                "
                                :isValid="checkIfValid('category_name')"
                                :invalidFeedback="
                                    categoryNameFeedback
                                        ? categoryNameFeedback
                                        : 'Enter a valid category name'
                                "
                            />
                            <CInput
                                horizontal
                                label="Sequence"
                                :lazy="false"
                                :value.sync="$v.expenseCategory.sequence.$model"
                                :isValid="checkIfValid('sequence')"
                                :invalidFeedback="
                                    sequenceFeedback
                                        ? sequenceFeedback
                                        : 'Enter a valid sequence number'
                                "
                            />
                            <br />
                            <CButton
                                type="submit"
                                color="primary"
                                class="m-1"
                                @click="
                                    update ? updateCategory() : addCategory()
                                "
                                :style="{ float: 'right' }"
                                >Submit</CButton
                            >

                            <CButton
                                type="submit"
                                color="secondary"
                                class="m-1"
                                @click="addModal = false"
                                :style="{ float: 'right' }"
                                >Cancel</CButton
                            >
                        </CModal>
                    </CRow>
                </CCardHeader>
                <CCardBody>
                    <CDataTable
                        :items="expenseCategoryList"
                        :fields="fields"
                        :column-filter="false"
                        :items-per-page="10"
                        hover
                        sorter
                        pagination
                        @filtered-items-change="setCurrentItems"
                    >
                        <template #action="{ item, index }">
                            <td class="py-0">
                                <CButton
                                    color="success"
                                    square
                                    size="sm"
                                    class="m-1"
                                    @click="editItem(item, index)"
                                    v-c-tooltip="{
                                        content: '<strong>Edit</strong>',
                                        placement: 'bottom'
                                    }"
                                >
                                    <CIcon name="cil-pencil" />
                                </CButton>
                                <CButton
                                    v-if="item.delete_allowed != false"
                                    color="danger"
                                    square
                                    size="sm"
                                    class="m-1"
                                    @click="deleteItem(item)"
                                    v-c-tooltip="{
                                        content: '<strong>Delete</strong>',
                                        placement: 'bottom'
                                    }"
                                >
                                    <CIcon name="cil-x-circle" />
                                </CButton>
                            </td>
                        </template>
                    </CDataTable>
                </CCardBody>
            </CCard>
        </CCol>
        <CModal
            title="Delete Category"
            :show.sync="deleteModal"
            class="disable-footer"
            centered
            fade
        >
            <center>
                Are you sure you want to delete ?
                <div class="inactive-modal-response">
                    <CButton
                        type="submit"
                        color="primary"
                        class="m-1"
                        @click="deleteCategory"
                        >Yes</CButton
                    >
                    <CButton
                        type="submit"
                        color="secondary"
                        class="m-1"
                        @click="deleteModal = false"
                        >No</CButton
                    >
                </div>
            </center>
        </CModal>
        <CModal
            title="Delete Response"
            :show.sync="deleteResponseModal"
            class="disable-footer"
            centered
            fade
        >
            <center>
                This income category is already selected in a course.
                <div class="inactive-modal-response">
                    <CButton
                        type="submit"
                        color="primary"
                        class="m-1"
                        @click="deleteResponseModal = false;"
                        >Ok</CButton
                    >
                </div>
            </center>
        </CModal>
    </CRow>
</template>

<script>
import queries from './categoryQueries';
import { validationMixin } from 'vuelidate';
import { required, numeric } from 'vuelidate/lib/validators';

const fields = [
    { key: 'category_name' },
    { key: 'sequence' },
    {
        key: 'action',
        label: 'Action',
        _style: 'min-width: 6rem',
        sorter: false,
        filter: false
    }
];
export default {
    data() {
        return {
            fields,
            addModal: false,
            deleteModal: false,
            deleteResponseModal: false,
            update: false,
            addSequence: '',
            expenseCategory: this.getEmptyForm(),
            expenseCategoryList: [],
            categoryNameFeedback: '',
            sequenceFeedback: '',
            selectedCategoryIndex: ''
        };
    },
    computed: {
        formString() {
            return JSON.stringify(this.expenseCategory, null, 2);
        },
        isValid() {
            return !this.$v.expenseCategory.$invalid;
        },
        isDirty() {
            return this.$v.expenseCategory.$anyDirty;
        }
    },
    mixins: [validationMixin],
    validations: {
        expenseCategory: {
            category_name: {
                required,
                isValidCategory(val) {
                    for (const [
                        index,
                        el
                    ] of this.expenseCategoryList.entries()) {
                        if (
                            index === this.selectedCategoryIndex &&
                            val == el.category_name
                        ) {
                            this.categoryNameFeedback = '';
                            return true;
                        }
                        if (el.category_name == val) {
                            this.categoryNameFeedback =
                                'Category name already exist';
                            return false;
                        }
                    }
                    this.categoryNameFeedback = '';
                    return true;
                }
            },
            sequence: {
                required,
                numeric,
                isValidSequence(val) {
                    for (const [
                        index,
                        el
                    ] of this.expenseCategoryList.entries()) {
                        if (
                            index === this.selectedCategoryIndex &&
                            val == el.sequence
                        ) {
                            this.sequenceFeedback = '';
                            return true;
                        }
                        if (el.sequence == val) {
                            this.sequenceFeedback = 'Sequence already exist';
                            return false;
                        }
                    }
                    this.sequenceFeedback = '';
                    return true;
                }
            }
        }
    },
    methods: {
        // Validation
        checkIfValid(fieldName) {
            const field = this.$v.expenseCategory[fieldName];
            if (!field.$dirty) {
                return null;
            }
            return !(field.$invalid || field.$model === '');
        },

        validate() {
            this.$v.$touch();
        },

        reset() {
            this.expenseCategory = this.getEmptyForm();
            this.$v.$reset();
        },

        getEmptyForm() {
            return {
                sequence: '',
                category_name: ''
            };
        },

        setCurrentItems(val) {
            this.currentItems = val;
        },
        editItem(item, index) {
            this.addModal = true;
            this.update = true;
            this.selectedCategoryIndex = index;
            delete item.__typename;
            this.reset();
            this.expenseCategory = {
                ...item
            };
        },
        deleteItem(item) {
            this.expenseCategory = {
                ...item
            };
            this.deleteModal = true;
        },
        addCategory() {
            this.validate();
            if (this.expenseCategory && this.isValid) {
                this.$apollo
                    .mutate({
                        mutation: queries.INSERT_EXPENSE_CATEGORY,
                        variables: this.expenseCategory
                    })
                    .then(res => {
                        const result =
                            res?.data?.insert_budget_app_expense_category?.returning;
                        if (result[0].id > 0) {
                            this.addModal = false;
                            this.$apollo.queries.categoryData.refetch();
                            this.expenseCategoryList.push(this.expenseCategory);
                            this.reset();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            this.addModal = false;
        },
        updateCategory() {
            this.validate();
            if (this.isValid) {
                this.$apollo
                    .mutate({
                        mutation: queries.UPDATE_EXPENSE_CATEGORY,
                        variables: this.expenseCategory
                    })
                    .then(res => {
                        const result =
                            res?.data?.update_budget_app_expense_category?.returning;
                        if (result[0].id > 0) {
                            this.addModal = false;
                            this.$apollo.queries.categoryData.refetch();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                this.editModal = false;
            }
        },
        deleteCategory() {
            this.$apollo
                .mutate({
                    mutation: queries.DELETE_EXPENSE_CATEGORY,
                    variables: {
                        id: this.expenseCategory.id
                    }
                })
                .then(res => {
                    const result =
                        res?.data?.delete_budget_app_expense_category?.returning;
                    if (result[0].id > 0) {
                        this.$apollo.queries.categoryData.refetch();
                        this.deleteModal = false;
                        this.editModal = false;
                    }
                })
                .catch(err => {
                    if(JSON.stringify(err).includes('Foreign key violation')) {
                        this.deleteModal = false;
                        this.deleteResponseModal = true;
                    }
                });
        }
    },
    apollo: {
        categoryData: {
            query: queries.GET_EXPENSE_CATEGORY,
            update: data => data,
            result({ data }) {
                this.update = false;
                this.expenseCategoryList = data?.budget_app_expense_category;
            }
        }
    }
};
</script>
