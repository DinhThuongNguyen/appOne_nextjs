//import Head from "next/head";
import styles from "../styles/Home.module.css";
import BaseLayout from "../components/Layouts/BaseLayout/BaseLayout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../ContextAPI/Auth-context";
import Axios from "axios";
import { Cards } from "../components/Layouts/Cards";
import Card from "../components/Layouts/Cards/Card";
import BaseContent from "../components/Layouts/BaseContent";

export default function Home(props) {
  const auth = useContext(AuthContext);
  const [arrTag, setArrTag] = useState([]);
  const { kqFB, kqGG, arr, pageHome } = props;

  useEffect(() => {
    setArrTag(pageHome);
    const storedData = JSON.parse(localStorage.getItem("account"));
    if (!storedData) {
      if (kqFB.email || kqGG.email) {
        const kq = kqFB.email ? kqFB : kqGG;
        auth.login(kq._id, kq.role, kq.name, kq.avatar);
      }
    }
  }, [auth.login, arrTag]);

  return (
    <BaseLayout title="HOME">
      <div className={styles.container}>
        <section className={styles.block}>
          <section className={styles.blockContent}>
            <div className={styles.one}>
              <Cards cls="h1_c3" loaitin="all">
                {arr.map((item, idx) => (
                  <Card
                    cls="card_big"
                    id={item.idTag}
                    tag={item.tag}
                    key={idx}
                  ></Card>
                ))}
              </Cards>
            </div>
            <div className={styles.two}>
              <BaseContent>
                {arrTag.map((item, idx) => (
                  <Cards cls="h2_c2" loaitin={item.tag} key={idx}>
                    <div className={styles.desktop}>
                      {item.arrId.map((item_, idx) => (
                        <Card
                          cls="card_small"
                          id={item_}
                          tag={item.tag}
                          key={idx}
                        />
                      ))}
                    </div>
                    <div className={styles.notDesktop}>
                      {item.arrId.slice(0, 2).map((item_, idx) => (
                        <Card
                          cls="card_small"
                          id={item_}
                          tag={item.tag}
                          key={idx}
                        />
                      ))}
                    </div>
                  </Cards>
                ))}
              </BaseContent>
            </div>
          </section>
        </section>
      </div>
    </BaseLayout>
  );
}

export async function getStaticProps() {
  const fetch_one = await Axios.get("http://localhost:3000/api/auth/good");
  const fetch_two = await Axios.get("http://localhost:3000/api/authfb/info");
  const kqGG = (await fetch_one.data.result)
    ? fetch_one.data.result
    : fetch_one.data.message;
  const kqFB = (await fetch_two.data.result)
    ? fetch_two.data.result
    : fetch_two.data.message;

  const newsFeed = await Axios.get("http://localhost:3000/api/getTag/newsFeed");
  const getTag = await Axios.get("http://localhost:3000/api/getTag/listNews")
    .then((res) => {
      return res.data.mang;
    })
    .catch((err) => console.log(err));

  // const tags = getTag.data.result;
  const arr = newsFeed.data.arr;
  const pageHome = getTag.slice(0, 4);

  return {
    props: {
      kqFB,
      kqGG,
      arr,
      pageHome,
    }, // will be passed to the page component as props
  };
}
