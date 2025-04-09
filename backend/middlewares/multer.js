import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    // limits: {
    //     fileSize: 5 * 1024 * 1024, // 5 MB
    // },
    // fileFilter: (req, file, cb) => {
    //     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    //     if (!allowedTypes.includes(file.mimetype)) {
    //         return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    //     }
    //     cb(null, true);
    // },
});
export default upload;