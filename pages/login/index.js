import React, { useContext, useEffect, useState } from "react";
import css from "./style.module.scss";
import BaseLayout from "../../components/Layouts/BaseLayout/BaseLayout";
import { Form, Formik } from "formik";
import {object, string} from "yup";
import FormikControls from "../../components/FormikForm/FormControls";
import axios_one from "../../Axios/methodApi";
import axios_two from "axios";
import { AuthContext } from "../../ContextAPI/Auth-context";
import {useRouter} from "next/router";
import Link from "next/link";

const index = () => {
  const context = useContext(AuthContext);
  const [textError, setTextError] = useState("");
  const route = useRouter();
  const initialValues = {
    data: "",
    password: "",
  };


  const validationSchema = object({
    data: string().required("Hãy nhập thông tin"),
    password: string().required("Chưa nhập mật khẩu"),
  });

  const onSubmit = (values) => {
    const data = {
      data: values.data,
      password: values.password,
    };

    const fetching = () => {
      axios_one
        .post("/account/login", data)
        .then(async (res) => {
          await context.login(
            res.accountId,
            res.role,
            res.name,
            res.avatar
          );
          await setTextError("");
          await route.push("/")
        })
        .catch((err) => {
          setTextError(err.response.data.message)
        });
    };
    fetching();
  };

  useEffect(() => {

  })

  const loginWithGoogle_ = () => {
    route.push("/api/auth/google");
  };
  const loginWithFacebook = () => {
    route.push("/api/authfb/facebook");
  };

  return (
    <BaseLayout title="Đăng nhập tài khoản" >
      <div className={css.signup}>
        <div className={css.signup__content}>
          <h4>Đăng nhập</h4>
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
                    label="Tên đăng nhập"
                    name="data"
                    placeholder="Nhập email hoặc tên tài khoản"
                  />
                  <FormikControls
                    control="input"
                    type="password"
                    label="Mật khẩu"
                    name="password"
                    placeholder="Nhập mật khẩu"
                  />
                    {textError.length > 0 && <p style={{color:"red", textAlign:"center", width: "100%"}}>{textError}</p>}
                    {textError === "sai mật khẩu" && <p style={{color:"black", textAlign:"center", width: "100%"}}>Nếu bạn quên mật khẩu, hãy <Link href="/quenmatkhau"><a style={{color: "blue"}}>tạo mật khẩu mới !</a></Link></p>}
                  <div className={css.btnSubmit}>
                    <button
                      type="submit"
                      disabled={!formik.isValid}
                      className={css.buttonControl}
                      className="mx-auto"
                    >
                      Đăng nhập
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

          <div className={css.signup__content__loginWithFbGg}>
            <div className={css.signup__content__loginWithFbGg__google}>
              <button className="btn btn-primary" onClick={loginWithGoogle_}>Login with Google</button>
              
            </div>
            <div className={css.signup__content__loginWithFbGg__facebook}>
              <button className="btn btn-success" onClick={loginWithFacebook}>Login with Facebook</button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default index;
