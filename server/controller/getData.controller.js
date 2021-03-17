const dbBlog = require("../database/blogData");
const dbTag = require("../database/nhanBaiViet");
const dbPage = require("../database/page");

exports.getContentBlog = async (req, res) => {
  const {blogId} = req.params;
  if(!blogId) {
    return res.status(404).json({message: "Khong co id"})
  }
  try {
    const baiviet = await dbBlog.findById(blogId, '-creator').exec();
    if(!baiviet) {
      return res.status(404).json({message: "sai id"})
    }
    return res.status(200).json({result: baiviet})
  } catch (error) {
    return res.status(500).json({message: "da xay ra loi"})
  }
}

exports.getCategories = async (req, res) => {
  const {idPage} = req.params;
  try {
    const page = await dbPage.findById(idPage);
    return res.status(200).json({result: page.toObject({getters: true})});
  } catch (error) {
    return res.status(404).json({message: "error get tag"})
  }
}
exports.loaitin = async (req, res) => {
  const {page, limit} = req.query;
  const {genres} = (req.params);
  if(typeof parseInt(page) !== "number" || typeof parseInt(limit) !== "number"){
    return res.status(404).json({message: "sai du lieu dau vao"});
  }
  try {
    dbTag.findOne({tag: genres},async (err, item) => {
      err && res.status(404).json({message: "loi get tag"});
      !item && res.status(404).json({message: "tag khong hop le"});
      const arrTag = await item.idTag.reverse();
      return res.status(200).json({arrTag: arrTag.slice(parseInt(limit) * (parseInt(page) - 1), (parseInt(page) * parseInt(limit)))})
    });
  
  } catch (error) {
    console.log(error);
    return res.status(405).json({message: "da bi loi"})
  }
}

exports.getMostView = async (req, res) => {
  try {
    const arr = await dbBlog.find({}, '-creator').sort({"luotxem": -1});
    return res.status(200).json({result: arr.slice(0, 9).map(item => item.toObject({getters: true}))})
  } catch (error) {
    return res.send("err")
  }
}

exports.mostView = async (req, res) => {
  const {idBlog} = req.body;
  if(!idBlog){
    return res.staus(404).json({message: "Khong co id"});
  }
  try {
    const blog = await dbBlog.findById(idBlog);
    if(!blog){
      return res.status(404).json({message: "id kong hop le"})
    } else {
      blog.luotxem = await blog.luotxem + 1 ;
      await blog.save();
      res.send("ok")
    }
  } catch (error) {
    return res.status(405).json({message: "loi lay du lieu"}); 
  }
}