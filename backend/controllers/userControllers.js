export const getCurrentUser = (req, res) => {
    try {
        if(!req.user){
            return res.status(404).json({ user:null});
        }
        return res.json(req.user)
    } catch (error) {
        res.status(500).json({ message: `Error fetching user: ${error.message}` });
    }
}