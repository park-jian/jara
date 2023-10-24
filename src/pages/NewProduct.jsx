import React, { useState } from "react";
import Button from "../components/ui/Button";
import { uploadImage } from "../api/uploader";
import { addNewProduct } from "../api/firebase";

export default function NewProduct() {
  const [product, setProduct] = useState({});
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    //이름이 file인 경우에만 setFile을 해준다.
    if (name === "file") {
      setFile(files && files[0]);
      //files[0] : 파일객체 name: "파일명", size: 12312, type: "image/webp", webkitRelativePath: "", lastModified: 123123133, lastModifiedDate: 객체
      return;
    }
    //그렇지 않은 경우에는 product 객체에 없데이트 되는 부분만 덮어쓰기 해준다.
    setProduct((product) => ({ ...product, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    //제품의 사진을 Cloudinary에 업로드 하고 URL을 획득
    //Firebase에 새로운 제품을 추가함
    uploadImage(file)
      .then((url) => {
        console.log("url:", url);
        addNewProduct(product, url).then(() => {
          setSuccess("성공적으로 제품이 추가 되었습니다.");
          setTimeout(() => {
            setSuccess(null);
          }, 4000);
        });
        //firebase에 새로운 제품을 추가함
      })
      .finally(() => setIsUploading(false));
  };
  return (
    <section className="w-full text-center">
      <h2 className="text-2xl font-bold my-4">새로운 제품 등록</h2>
      {success && <p className="my-2">✅ {success}</p>}
      {file && (
        <img
          className="w-96 mx-auto mb-2"
          src={URL.createObjectURL(file)}
          alt="local file"
        />
      )}
      <form className="flex flex-col px-12" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          name="file"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="title"
          value={product.title ?? ""}
          placeholder="제품명"
          required
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          value={product.price ?? ""}
          placeholder="가격"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          value={product.category ?? ""}
          placeholder="카테고리"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          value={product.description ?? ""}
          placeholder="제품 설명"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="options"
          value={product.options ?? ""}
          placeholder="옵션들(콤마(,)로 구분)"
          required
          onChange={handleChange}
        />
        <Button
          text={isUploading ? "업로드중..." : "제품 등록하기"}
          disabled={isUploading}
        />
      </form>
    </section>
  );
}
