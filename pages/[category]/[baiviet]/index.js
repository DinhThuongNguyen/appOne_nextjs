import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Axios from '../../../Axios/methodApi';
// import methodApi from '../../../Axios/methodApi';
import BaseContent from '../../../components/Layouts/BaseContent';
import BaseLayout from '../../../components/Layouts/BaseLayout/BaseLayout';
import Card from '../../../components/Layouts/Cards/Card';
import css from "./style.module.scss";

const baiviet = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const {baiviet, category} = router.query;
  const [sameNew, setSameNew] = useState([]);
  const noidung = useRef();

  useEffect(async () => {
    const dl = {idBlog: baiviet} 
    
    if(category === "luong-y-vo-hoang-yen" || category === "trung-tam-vo-hoang-yen"){
      const fetchData = async () => {
        const kq = await Axios.get(`/loadData/page/${baiviet}`);
        if(kq.result){
          setContent(kq.result.title);
          noidung.current.innerHTML = kq.result.content;
        }
      }
      fetchData();
    } else if(baiviet){
      await Axios.get(`/loadData/${baiviet}`)
        .then(res => {
          setContent( res.result.title);
          noidung.current.innerHTML = res.result.content;
        })
        .catch(err => console.log(err))

      await Axios.get(`/loadData/${category}/all?page=1&limit=5`)
              .then( res=> {
                const arr = res.arrTag.filter(id => id !== baiviet);
                if(arr.length === 5){
                  setSameNew(arr.splice(0, 1));
                } else {
                  setSameNew(arr);
                }
              })
              .catch(err => {
                console.log({err});
              })

      await Axios.patch("/loadData/viewupdate", dl)
      .then(res => {
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
      })        
    }
  },[baiviet]);

  return (
    <BaseLayout title={content}>
      <div className={css.content}>
        <BaseContent>
          <div className={css.content__title}>
            <h4>{content}</h4>
          </div>
          <div className={css.content__noidung} id="noidung" ref={noidung}></div>
        </BaseContent>
        <div className={css.content__sameNews}>
          <div className={css.content__sameNews__card}>
            <div className={css.content__sameNews__card__desktop}>
            {
              sameNew.length > 0 && sameNew.map((item, idx) => (
                <Card cls="card_small" id={item} tag={category} key={idx}/>
              ))
            }
            </div>
            <div className={css.content__sameNews__card__notDesktop}>
            {
              sameNew.length > 0 && sameNew.slice(0, 2).map((item, idx) => (
                <Card cls="card_small" id={item} tag={category} key={idx}/>
              ))
            }
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default baiviet
