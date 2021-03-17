const multer = require('multer');
const { v4 : uuidv4 } =  require('uuid');

const TYPE_IMAGE ={ 
  'image/png' : 'png',
  'image/jpeg' : 'jpeg',
  'image/jpg' : 'jpg'
};

const fileUpLoad = multer({
  limits: 5000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/Images');//đây là nơi lưu image
    },
    filename: (req, file, cb) => {
      const temp = TYPE_IMAGE[file.mimetype];
      cb(null, uuidv4()+'.'+temp);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!TYPE_IMAGE[file.mimetype];
    let error = isValid ? null : new Error('Invalid type image');
    cb(error, isValid);
  } 
});

module.exports = fileUpLoad;