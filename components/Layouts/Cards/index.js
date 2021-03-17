import React, { useEffect, useState } from "react";
import methodApi from "../../../Axios/methodApi";
import css from "./style.module.scss";
import Link from "next/link";

export const Cards = (props) => {
  const [classes, setClasses] = useState("");
  const { cls, loaitin } = props;
  useEffect(() => {
    switch (cls) {
      case "h1_c3":
        setClasses(css.h1_c3);
        break;
      case "h2_c2":
        setClasses(css.h2_c2);
        break;
      case "h1_c2":
        setClasses(css.h1_c2);
        break;

      default:
        break;
    }
  }, [cls]);

  return (
    <div className={classes}>
      {classes === css.h2_c2 && (
        <p>
          <Link href={`/${loaitin.replaceAll(" ", "-")}/page/1`}><a>Load more</a></Link>
        </p>
      )}
      {classes === css.h2_c2 ? (
        <div className={css.h2_c2__content}>{props.children}</div>
      ) : (
        props.children
      )}
    </div>
  );
};
