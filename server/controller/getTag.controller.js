const dbTag = require("../database/nhanBaiViet");
const dbBlog = require("../database/blogData");
const { db } = require("../database/blogData");

exports.getTag = async (req, res) => {
  try {
    const arr = [];
    const tag = await dbTag.find().sort({ sobaiviet: -1 });
    tag.map((item) => {
      arr.push(item.tag);
    });
    return res.status(200).json({result: arr});
  } catch (error) {
    return res.status(404).json({message: "Da xay ra loi"})
  }
};

exports.newsFeed = async (req, res) => {
  try {
    const arrTag = [];
    const tags = await dbTag.find();
    tags.map((item) => arrTag.push(item.tag));
    const blog = await dbBlog.find();
    const arr = [];
    const arrId = [];
    let flagTag = "";
    const bl = blog.reverse();
    const obj = {
      tag: "",
      idTag: "",
    };
    bl.map(async (item, idx) => {
      if (idx <= 2) {
        obj.tag = item.tag;
        obj.idTag = item.id;
        const a = { ...obj };
        arr.push(a);
      }
    });
    flagTag = arr[0].tag;
    for (let i of arr) {
      if (i.tag !== flagTag) {
        arrId.push(i.id);
      }
    }
    return res.status(200).json({ arr: arr, arrId: arrId, arrTag: arrTag });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Da xay ra loi" });
  }
};

exports.tintuc = async (req, res) => {
  try {
    const blog = await dbBlog.find();
    const arrBlog = blog.reverse().slice(0,3);
    const a = [];
    arrBlog.map(item => a.push(item.id));

    const tags = await dbTag.find();
    const arrTag = [];
    tags.map(item => arrTag.push(item.tag));
    const mang = [];

    arrTag.map(async (item, idx) => {
      await dbTag.findOne({tag: item}, (err, tag) => {
        const m = tag.idTag;
        const obj = {
          "tag": "",
          "arrId": []
        }
        let x = 0;
        if(m.length >= 4){
          for(let i = 0; i< a.length; i++){
            if(m.includes(a[i])){
              ++x;
            }
            if(x === 2){
              break;
            }
          }
          let arrNew
          if(x === 1){
            arrNew = m.reverse().slice(1,5);
            obj.tag = tag.tag;
            obj.arrId = arrNew;
          }
          if(x === 0){
            arrNew = m.reverse().slice(0, 4);
            obj.tag = tag.tag;
            obj.arrId = arrNew;
          }
          
          if( arrNew ){
            const mm = {...obj};
            mang.push(mm)
          }
        }
        if(idx === arrTag.length - 1){
          return res.status(200).json({mang: mang});
        }
      })
    })
    // res.send(mang);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Da xay ra loi" });
  }
};
