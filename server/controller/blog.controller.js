const { validationResult } = require("express-validator");
const dbPOST = require("../database/blogData");
const dbAccount = require("../database/account");
const dbTag = require("../database/nhanBaiViet");
const mongoose = require("mongoose");

exports.postBlog = async (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(405).json({ message: "Value input failed" });
  }
  const { title, description, content, tag, images, date } = req.body;

  try {
    const post = await new dbPOST({
      title,
      description,
      content,
      tag: tag
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D"),
      images,
      date,
      creator: req.account.accountId,
      luotxem: 0,
    });

    let valueAccount;
    try {
      valueAccount = await dbAccount.findById(req.account.accountId);
    } catch (error) {
      return res.status(404).json({ message: "Cannot create new posts" });
    }
    if (!valueAccount) {
      return res.status(405).json({ message: "No data account" });
    }

    let sess;
    try {
      sess = await mongoose.startSession();
      sess.startTransaction();
      await post.save({ session: sess });
      await valueAccount.posts.push(post);
      await valueAccount.save({ session: sess });
      await sess.commitTransaction();
    } catch (error) {
      return res
        .status(405)
        .json({ message: "Không thể tạo bài mới, đã xảy ra lỗi" });
    }

    dbTag.findOne({ tag: tag }, async (err, item) => {
      if (err) {
        return res.status(404).json({ message: "loi tag" });
      }
      try {
        if (!item) {
          const arr = [];
          arr.push(post.id);
          const newTag = await new dbTag({
            tag: tag
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d")
              .replace(/Đ/g, "D"),
            sobaiviet: 1,
            idTag: arr,
          });
          await newTag.save();
        } else {
          let total = (item.sobaiviet);
          total += 1;
          await item.idTag.push(post.id);
          item.sobaiviet = await total;
          await item.save();
        }
      } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "loi tag err" });
      }
    });

    return res.status(200).json({ contents: post.toObject() });
  } catch (error) {
    return res.status(405).json({ message: "Can not post data, try again" });
  }
};

exports.getDataWithAccount = async (req, res) => {
  const idAccount = req.account.accountId;
  if (!idAccount) {
    return res.status(405).json({ message: "Không có id account" });
  }

  let dataBlog;
  try {
    dataBlog = await dbPOST.find({ creator: idAccount });
    const tempData = await dataBlog.reverse();
    return res
      .status(200)
      .json({ res: tempData.map((item) => item.toObject({ getters: true })) });
  } catch (error) {
    return res.status(405).json({ message: "Loi khong tim thay account" });
  }
};

exports.XoaBai = async (req, res) => {
  const { idDelete, nhan } = req.body;
  if (!idDelete) {
    return res.status(404).json({ message: "Error delete" });
  }

  dbTag.findOne({ tag: nhan }, async (err, item) => {
    if (err) return res.status(404).json({ message: "loi xoa tag err" });
    if (!item) return res.status(404).json({ message: "loi xoa tag item" });
    const arr = item.idTag;
    const idx = arr.findIndex((item) => item === idDelete);
    await arr.splice(idx, 1);
    item.idTag = arr;
    item.sobaiviet -= 1;
    item.save();
  });

  let blog;
  try {
    blog = await dbPOST.findById(idDelete).populate("creator");
  } catch (error) {
    return res.status(404).json({ message: "Không có bài viết" });
  }

  if (!blog || blog.creator.id !== req.account.accountId) {
    return res.status(405).json({ message: "Không thể xóa bài viết" });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await blog.remove({ session: sess });
    await blog.creator.posts.pull(blog);
    await blog.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return res
      .status(405)
      .json({ message: "Something went wrong, could not delete place." });
  }

  const idBlog = req.account.accountId;
  const kq = await dbPOST.find({ creator: idBlog });
  res
    .status(200)
    .json({ result: kq.map((item) => item.toObject({ getters: true })) });
};

exports.getDataBlog = async (req, res) => {
  const id = req.params.blogId;
  if (!id) {
    return res.status(404).json({ message: "khong co id" });
  }
  let dataBlog;
  try {
    dataBlog = await dbPOST.findById(id);
  } catch (error) {
    return res.status(405).json({ message: "loi data" });
  }
  if (!dataBlog) {
    return res.statys(405).json({ message: "khong co bai viet" });
  }

  res.status(200).json({ result: dataBlog.toObject({ getters: true }) });
};

exports.updateBlog = async (req, res) => {
  const id = req.params.idUpdate;
  const { title, description, content, tag } = req.body;
  if (!id) {
    return res.status(405).json({ message: "Khong tim thay id" });
  }

  let dataBlog;

  try {
    dataBlog = await dbPOST.findById(id);
  } catch (error) {
    return res.status(405).json({ message: "error data" });
  }

  if (!dataBlog) {
    return res.status(404).json({ message: "Khong tim thay bai post" });
  }

  dbTag.findOne({ tag: tag }, async (err, item) => {
    if (err) {
      return res.status(404).json({ message: "loi tag" });
    }
    try {
      if (!item) {
        const arr = [];
        arr.push(dataBlog.id);
        const newTag = await new dbTag({
          tag: tag
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D"),
          sobaiviet: 1,
          idTag: arr,
        });
        await newTag.save();
      } else if(dataBlog.tag !== tag){
        let total = (item.sobaiviet);
        total += 1;
        await item.idTag.push(dataBlog.id);
        item.sobaiviet = await total;
        await item.save();
      }
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: "loi tag err" });
    }
  });

  try {
    dataBlog.title = title;
    dataBlog.description = description;
    dataBlog.content = content;
    dataBlog.tag = tag
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

    await dataBlog.save();
  } catch (error) {
    return res.status(500).json({ message: "khong the update" });
  }

  res.status(200).json({ result: dataBlog.toObject({ getters: true }) });
};

exports.getAllData = async (req, res) => {
  try {
    const data = await dbPOST.find({ tag: "Bài mới" });
    await data.map(async (item) => {
      item.tag = await "bai moi";
      await item.save();
    });
    await res.send("ok");
  } catch (error) {
    return res.send(error);
  }

  // const { number } = req.params;
  // const trang = parseInt(number);
  // console.log(parseInt(number));
  // if (trang < 0) {
  //   return res.status(404).json({ message: "Khong the lay duoc du lieu" });
  // } else if (trang === 0) {
  //   try {
  //     const contentData = await dbPOST.find();
  //     return res.status(200).json({ result: contentData.map() });
  //   } catch (error) {}
  // }
};
