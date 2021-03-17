import React, { useContext } from "react";
import css from "./style.module.scss";
import BaseLayout from "../../../components/Layouts/BaseLayout/BaseLayout";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControls from "../../../components/FormikForm/FormControls";
import Image from "../../../components/FormikForm/FormImage/Image";
import { useRouter } from "next/router";
import axios from "../../../Axios/methodApi";
import { AuthContext } from "../../../ContextAPI/Auth-context";
import { useEffect } from "react";
import Link from "next/link";

const index = ({kq}) => {
  const route = useRouter();
  const context = useContext(AuthContext);
  const options = [
    { key: "Nam", value: "nam" },
    { key: "Nữ", value: "nu" },
  ];
  const initialValues = {
    name: kq.name,
    email: kq.email,
    password: "",
    confirmPassword: "",
    genre: "",
    phone: "",
    avatar: kq.avatar,
  };
  const FILE_SIZE = 1920 * 1080;
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
  ];
  const phoneRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const header = { "Content-type": "application/json" };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(8, "Tên quá ngắn (phải 8 ký tự trở lên)")
      .max(30, "Tên quá dài (phải 30 ký tự trở lại)")
      .required("Hãy nhập tên"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Hãy nhập email"),
    password: Yup.string().required("Chưa nhập mật khẩu"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), ""],
        "Mật khẩu nhập lại phải trùng với mật khẩu đã nhập ở trên."
      )
      .required("Hãy nhập lại mật khẩu"),
    genre: Yup.string().required("Chưa chọn giới tính"),
    phone: Yup.string()
      .matches(phoneRegex, "Chỉ bao gồm các chữ số")
      .required("Chưa nhập số điện thoại"),
    avatar: Yup.mixed().required("Avatar không được để trống"),
    // .test(
    //   "imageSize",
    //   "File to large",
    //   (value) => value && value.size <= FILE_SIZE
    // )
    // .test(
    //   "imageFormat",
    //   "Incorrect image format",
    //   (value) => value && SUPPORTED_FORMATS.includes(value.type)
    // )
  });

  const onSubmit = (values) => {
    const data = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      genre: values.genre,
      avatar: values.avatar,
    };

    axios
      .post("/account/register", data, header)
      .then((res) => {
        context.login(res.accountId, res.role, res.name, res.avatar);
        route.push("/");
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <>
      {
        kq === "No data" ? <p style={{textAlign: "center"}}>Đăng ký tài khoản mới <Link href="/signup"><a style={{color:"blue"}}>tại đây</a></Link></p> :
        <BaseLayout title="Đăng ký tài khoản">
      <div className={css.signup}>
        <div className={css.signup__content}>
          <h4>Đăng ký tài khoản</h4>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <FormikControls
                    control="input"
                    type="text"
                    label="Tên tài khoản"
                    name="name"
                  />
                  <FormikControls
                    control="input"
                    type="email"
                    label="Email"
                    name="email"
                  />
                  <FormikControls
                    control="input"
                    type="password"
                    label="Mật khẩu"
                    name="password"
                  />
                  <FormikControls
                    control="input"
                    type="password"
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                  />
                  <FormikControls
                    control="radio"
                    label="Giới tính"
                    name="genre"
                    options={options}
                  />
                  <FormikControls
                    control="input"
                    type="text"
                    label="Số điện thoại"
                    name="phone"
                  />
                  <FastField
                    name="avatar"
                    label="Ảnh đại diện"
                    type="file"
                    component={Image}
                  />
                  <div className={css.btnSubmit}>
                    <button
                      type="submit"
                      disabled={!formik.isValid}
                      className={css.buttonControl}
                      className="mx-auto"
                    >
                      Tạo tài khoản
                    </button>
                  </div>
                  {formik.isSubmitting && (
                    <div className={css.loaded}>
                      <div className={css.sk__chase}>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                        <div className={css.sk__chase__dot}></div>
                      </div>
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </BaseLayout>
      }
    </>
  );
};

export async function getStaticProps({ params }) {
  const result = await axios.get("/authfb/info");
  const kq = await result.result ? result.result : "No data";
  //console.log(kq);
  // if(!kq) {
  //   return {
  //     notFound: true
  //   }
  // }
  return {
    props: { kq },
    // Re-generate the post at most once per second
    // if a request comes in
    // revalidate: 1,
  }
}

export default index;
