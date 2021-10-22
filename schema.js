const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const API_HOSTNAME = 'http://localhost:3000';

// type 선언
const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
    })
});

// Root Query (for Retrieve)
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        person: {
            type: PersonType,
            args: {
                id: { type: GraphQLString}
            },
            resolve(parentVal, args) {
                return axios.get(`${API_HOSTNAME}/people/${args.id}`)
                            .then(res => res.data)
            }
        },
        people: {
            type: new GraphQLList(PersonType),
            resolve(parentVal, args) {
                return axios.get(`${API_HOSTNAME}/people`)
                            .then(res => res.data)
            }
        }
    }
});

// mutation (for C, U, D)
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createPerson: {
            type: PersonType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parentVal, args) {
                return axios.post(`${API_HOSTNAME}/people`, {
                    name: args.name,
                    email: args.email,
                    age: args.age
                }).then(res => res.data);
            }
        },
        deletePerson: {
            type: PersonType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
              // add data
                return axios.delete(`${API_HOSTNAME}/people/${args.id}`)
                            .then(res => res.data);
            }
        },
        editPerson: {
            type: PersonType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parentValue, args) {
                // add data
                return axios.patch(`${API_HOSTNAME}/people/${args.id}`, args)
                            .then(res => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})