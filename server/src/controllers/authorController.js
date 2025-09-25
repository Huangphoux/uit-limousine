import db from "../db.js";

export async function getAuthorById(req, res) {
    const { authorId } = req.params;

    const author = await db.getAuthorById(+authorId);

    if (!author) {
        res.status(404).send("Author not found");
        return;
    }

    res.send(`Author Name: ${author.name}`);
}
