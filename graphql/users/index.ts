import { ApolloServer } from "@apollo/server";
import { GraphQLScalarType, Kind } from "graphql";
import { gql } from "graphql-tag";
import queries from "./queries";
import mutations from "./mutations";

const DateTime = new GraphQLScalarType({ // eslint-disable-line
  name: "DateTime",
  description: "ISO 8601 formatted date-time string",
  serialize(value: any) { // eslint-disable-line
    return new Date(value).toISOString(); // Convert Date to ISO string
  },
  parseValue(value: any) { // eslint-disable-line
    return new Date(value); // Convert ISO string to Date
  },
  parseLiteral(ast: any) { // eslint-disable-line
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});


const typeDefs = gql`
  scalar DateTime

  type Account {
    id: ID!
    userId: ID!
    type: String
    provider: String
    providerAccountId: String
    refresh_token: String
    access_token: String
    expires_at: DateTime
    token_type: String
    scope: String
    id_token: String
    session_state: String
  }

  type User {
    id: ID!
    name: String
    email: String
    emailVerified: String
    image: String
    password: String
    role: String
    timezone: String
    accounts: [Account]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Pagination {
    total: Int!
    totalPages: Int!
    page: Int!
    limit: Int!
  }

  type UserPagination {
    users: [User]!
    pagination: Pagination!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    getUsersPagination(page: Int!, limit: Int!): UserPagination
  }

  type Mutation {
    addUser(
      name: String!, 
      email: String!, 
      role: String!, 
      timezone: String!, 
      password: String!
    ): User
  }
`;

const resolvers = {
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
};

export const server = new ApolloServer({ typeDefs, resolvers });