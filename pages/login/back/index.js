import React from 'react'
import BaseLayout from '../../../components/Layouts/BaseLayout/BaseLayout'
import Link from "next/link";
const index = () => {
  return (
    <BaseLayout>
      <p style={{textAlign: "center"}}>
        Email này đã được đăng ký hãy <Link href="/login"><a style={{color:"blue"}}>đăng nhập</a></Link> hoặc <Link href="/signup"><a style={{color:"blue"}}>tạo tài khoản mới</a></Link>
      </p>
    </BaseLayout>
  )
}

export default index
