require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Author = require('./models/Author');
const Book = require('./models/Book');

console.log('connecting to', process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Author: {
    /* bookCount: (root) => {
      const booksByAuthor = books.filter((book) => book.author === root.name);
      return booksByAuthor.length;
    }, */
  },
  Book: {
    /* author: (root) => {
      return authors.find((author) => author.name === root.author);
    }, */
  },
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    /* allBooks: (root, args) => {
      if (!args.author && !args.genre) return books;
      if (args.author && args.genre) {
        return books.filter((book) => {
          return (
            book.author === args.author && book.genres.includes(args.genre)
          );
        });
      }
      if (args.author) {
        return books.filter((book) => book.author === args.author);
      }
      if (args.genre) {
        return books.filter((book) => book.genres.includes(args.genre));
      }
    }, */
    allAuthors: () => Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        author.save();
      }

      const book = new Book({ ...args, author: author._id });
      return book.save();
    },
    /* editAuthor: (root, args) => {
      let updatedAuthor;
      authors = authors.map((author) => {
        if (author.name !== args.name) {
          return author;
        } else {
          updatedAuthor = { ...author, born: args.setBornTo };
          return updatedAuthor;
        }
      });
      return updatedAuthor;
    }, */
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
