import gql from 'graphql-tag';

const CHECK_LOGIN = gql`
    query ($user_name: String!, $password: String!) {
        budget_app_login(
            where: { user_name: { _eq: $user_name }, password: { _eq: $password } }
        ) {
            id
        }
    }
`;

export default {
    CHECK_LOGIN
};
