import gql from 'graphql-tag';

const GET_CATEGORIES = gql`
    query MyQuery {
        budget_app_income_category(order_by: { sequence: asc }) {
            category_name
            sequence
            id
        }
        budget_app_expense_category(order_by: { sequence: asc }) {
            sequence
            id
            category_name
        }
    }
`;

const GET_BUDGET_DETAILS = gql`
    query($login_id: Int!) {
        budget_app_budget_details(
            order_by: { transaction_date: desc }
            where: { login_id: { _eq: $login_id } }
        ) {
            amount
            category
            description
            transaction_date
            type
        }
    }
`;

const GET_MONTHLY_SAVINGS = gql`
    query($login_id: Int!) {
        budget_app_monthly_savings_aggregate(
            where: { login_id: { _eq: $login_id } }
        ) {
            aggregate {
                sum {
                    amount
                }
            }
        }
    }
`;

const INSERT_BUDGET_DETAILS = gql`
    mutation(
        $amount: Int!
        $category: String!
        $description: String
        $type: String!
        $login_id: Int!
    ) {
        insert_budget_app_budget_details(
            objects: {
                amount: $amount
                category: $category
                description: $description
                type: $type
                login_id: $login_id
            }
        ) {
            returning {
                id
            }
        }
    }
`;

const INSERT_MONTHLY_SAVINGS = gql`
    mutation ($login_id: Int!, $amount: Int!) {
        insert_budget_app_monthly_savings(
            objects: { login_id: $login_id, amount: $amount }
        ) {
            returning {
                id
            }
        }
    }
`;

// To be implemented
// const UPDATE_BUDGET_DETAILS = gql``;

// const DELETE_BUDGET_DETAILS = gql``;

export default {
    GET_CATEGORIES,
    GET_BUDGET_DETAILS,
    GET_MONTHLY_SAVINGS,
    INSERT_BUDGET_DETAILS,
    INSERT_MONTHLY_SAVINGS
};
