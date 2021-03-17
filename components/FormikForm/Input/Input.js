import React from "react";
import css from "./style.module.scss";
import { Field, ErrorMessage } from "formik";
import TextError from "../textError/TextError";

const Input = (props) => {
  const { label, name, ...rest } = props;
  return (
    <div className="form-control">
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} {...rest} />
      {/* <div className={css.CTRinput}>
        
      </div> */}
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
};

export default Input;
