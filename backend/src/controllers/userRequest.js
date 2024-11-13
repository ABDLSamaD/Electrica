exports.requestUser = async (req,res)=>{
    try {
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Internal server error"})
    }
}