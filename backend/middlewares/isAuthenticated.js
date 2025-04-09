import jwt from "jsonwebtoken";


const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Please login first",
                success: false,
            });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }
        req.id = decoded.userID;
        next();
    } catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;
