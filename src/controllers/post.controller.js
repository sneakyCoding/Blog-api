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
    try {
        const posts = (await Post.find()).sort({ createdAt: -1 })
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

export const readPost = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) return res.status(400).json({
            message: "Invalid Input"
        });
        if (typeof id !== "string") res.status(400).json({
            message: "Invalid Input"
        });

        const post = await Post.findById(id);
        if (!post) res.status(404).json({
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

export const updatePost = async (req, res) => {
    /*
    -> Find user and check whether the user exists and then check whether they are the original author
    -> If they are: update, else throw error
    -> return response
     */
    const id = req.params.id
    const user = req.user._id
    if (!id) return res.status(400).json({
        message: "Bad request"
    });
    if (typeof id !== "number") return res.status(400).json({
        message: "Bad request"
    });
    if (!user) return res.status(400).json({
        message: "Bad request"
    });

    const post = await Post.findById(id)
    const isAuthor = user.toString() === post.author.toString()

    if(!isAuthor) return res.status(403).json({
        message: "Not Authorized"
    });

    const updatedPost =  await post.updateOne({
        title: title,
        content : content,
    })//something here -> no shit

    return res.status(200).json({
        message: "success",
        post : updatedPost
    })
    
}

export const deletePost = async (req, res) => {
    try {
        const id = req.params.id
        const user = req.user._id

        if (!user) return res.status(403).json({
            message: "Not Authorized"
        });
        if (!id) return res.status(400).json({
            message: "Bad request"
        });
        if (typeof id !== "number") return res.status(400).json({
            message: "Bad request"
        });

        const post = await Post.findById(id);
        const isAuthor = user.toString() === post.author.toString();
        if (!isAuthor) return res.status(403).json({
            message: "Not Authorized"
        })

        if (!post) return res.status(404).json({
            message: "Post does not exist"
        });

        Post.deleteOne({ post })

        return res.status(200).json({
            message: "success"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.."
        });
    }
}