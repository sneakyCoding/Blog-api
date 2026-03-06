import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "Invalid Credentials" });
        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") return res.status(400).json({ message: "Invalid Credentials" });
        if (name.trim() === "" || email.trim() === "" || password.trim() === "") return res.status(400).json({ message: "Invalid Credentials" });
        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

        const hashP = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashP });

        return res.status(201).json({
            status: "success",
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.."
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Invalid Credentials" });
        if (email.trim() === "" || password.trim() === "") return res.status(400).json({ message: "Invalid Credentials" });
        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const token = signToken(user._id);

        return res.status(200).json({
            status: "success",
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.."
        });
    }
};