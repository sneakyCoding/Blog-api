import Post from "../models/post.model.js"

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body
        if (!title || !content) return res.status(400).json({
            message: "Invalid Inputs"
        })
        if (title.trim() === "" || content.trim() === "") return res.status(400).json({
            message: "Invalid Inputs"
        })
        if (typeof title !== "string" || typeof content !== "string") return res.status(400).json({
            message: "Invalid Inputs"
        })

        const post = await Post.create({ title, content });

        return res.status(201).json({
            status: "Success",
            post
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.."
        });
    }
}

export const readAllPost = async (req, res) => {
    const posts = (await Post.find()).sort({createdAt: -1})
    try {
        return res.status(200).json({
            status: "success",
            posts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.."
        });
    }
}

export const readPost = async(req,res) => {
    try {
        const id = req.params.id
        if(!id) return res.status(400).json({
            message: "Invalid Input"
        });
        if(typeof id !== "string") res.status(400).json({
            message: "Invalid Input"
        });

        const post = Post.findById(id);
        if(!post) res.status(404).json({
            message: "No Post found"
        });

        return res.status(200).json({
            status: "success",
            post
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.."
        });
    }
}

export const updatePost = async (req,res) => {
    /*
    -> Take out the token from the header for authzn and updates from the body
    -> Find user and check whether the user exists and then check whether they are the original author
    -> If they are: update, else throw error
    -> return response
     */
}