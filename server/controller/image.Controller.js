const {validationResult} = require("express-validator");

exports.postImage = (req, res) => {
  try {
    const image = req.file;

    res.status(200).json({ path: `Images/${image.filename}` });
  } catch (error) {
    console.log({error});
    res.status(422).json({ message: "upload failed" });
  }
}

