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
    query ($login_id: Int!) {
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

export default {
    GET_CATEGORIES,
    GET_BUDGET_DETAILS
};
