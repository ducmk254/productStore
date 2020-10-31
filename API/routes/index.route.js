const indexController = require("../controllers/index.controller");

module.exports = (app)=>{
    app.route("/")
        .get((req,res)=> res.status(200).json({Message:"Homepage"}))
    app.route("/api/v0/books")
        .get(indexController.bookController.getBookList)
        .post(indexController.bookController.createABook)


    app.route("/api/v0/book/:book_id")
        .get(indexController.bookController.getBook)
        .put(indexController.bookController.updateBook)
        .delete(indexController.bookController.deleteBook)
    app.route("/api/v0/authors")
        .get(indexController.authorController.getAuthorList)
        .post(indexController.authorController.createAAuthor)


    app.route("/api/v0/author/:author_id")
        .get(indexController.authorController.getAAuthor)
        .put(indexController.authorController.updateAuthor)
        .delete(indexController.authorController.deleteAuthor)

    app.route("/api/v0/nxbs")
        .get(indexController.nxbController.getNXBList)
        .post(indexController.nxbController.createNXB)
    app.route("/api/v0/nxb/:nxb_id")
        .get(indexController.nxbController.getNXB)
        .put(indexController.nxbController.editNXB)
        .delete(indexController.nxbController.deleteNXB)


    app.route("/api/v0/bookcomments")
        .get(indexController.bookcomment.getCommentList)
        .post(indexController.bookcomment.createComment)
    app.route("/api/v0/bookcomment/:bookcomment_id")
        .get(indexController.bookcomment.getComment)
        .delete(indexController.bookcomment.deleteComment)

    app.route("/api/v0/customers")
        .get(indexController.customer.getCustomerList)
        .post(indexController.customer.createCustomer)
    app.route("/api/v0/customer/:customer_id")
        .get(indexController.customer.getCustomer)
        .put(indexController.customer.updateCustomer)
}