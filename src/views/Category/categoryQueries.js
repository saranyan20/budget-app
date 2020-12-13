import gql from 'graphql-tag';

// Income Categories

const GET_INCOME_CATEGORY = gql`
    query MyQuery {
        budget_app_income_category(order_by: { sequence: asc }) {
            category_name
            sequence
            id
        }
    }
`;

const INSERT_INCOME_CATEGORY = gql`
    mutation ($category_name: String!, $sequence: Int!) {
        insert_budget_app_income_category(
            objects: { category_name: $category_name, sequence: $sequence }
        ) {
            returning {
                id
            }
        }
    }
`;

const UPDATE_INCOME_CATEGORY = gql`
    mutation ($category_name: String!, $sequence: Int!, $id: Int!) {
        update_budget_app_income_category(
            where: { id: { _eq: $id } }
            _set: { category_name: $category_name, sequence: $sequence }
        ) {
            returning {
                id
            }
        }
    }
`;

const DELETE_INCOME_CATEGORY = gql`
    mutation ($id: Int!) {
        delete_budget_app_income_category(where: { id: { _eq: $id } }) {
            returning {
                id
            }
        }
    }
`;

// Expense Categories

const GET_EXPENSE_CATEGORY = gql`
    query MyQuery {
        budget_app_expense_category(order_by: { sequence: asc }) {
            sequence
            id
            category_name
        }
    }
`;

const INSERT_EXPENSE_CATEGORY = gql`
    mutation ($category_name: String!, $sequence: Int!) {
        insert_budget_app_expense_category(
            objects: { category_name: $category_name, sequence: $sequence }
        ) {
            returning {
                id
            }
        }
    }
`;

const UPDATE_EXPENSE_CATEGORY = gql`
    mutation ($category_name: String!, $sequence: Int!, $id: Int!) {
        update_budget_app_expense_category(
            where: { id: { _eq: $id } }
            _set: { category_name: $category_name, sequence: $sequence}
        ) {
            returning {
                id
            }
        }
    }
`;

const DELETE_EXPENSE_CATEGORY = gql`
    mutation ($id: Int!) {
        delete_budget_app_expense_category(where: { id: { _eq: $id } }) {
            returning {
                id
            }
        }
    }
`;

export default {
    GET_INCOME_CATEGORY,
    INSERT_INCOME_CATEGORY,
    UPDATE_INCOME_CATEGORY,
    DELETE_INCOME_CATEGORY,
    GET_EXPENSE_CATEGORY,
    INSERT_EXPENSE_CATEGORY,
    UPDATE_EXPENSE_CATEGORY,
    DELETE_EXPENSE_CATEGORY
};
