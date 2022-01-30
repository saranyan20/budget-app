import gql from 'graphql-tag';

const CHECK_LOGIN = gql`
    query($userName: String!, $password: String!) {
        budget_app_login(
            where: {
                user_name: { _eq: $userName }
                password: { _eq: $password }
            }
        ) {
            id
        }
    }
`;

export default {
    CHECK_LOGIN
};
