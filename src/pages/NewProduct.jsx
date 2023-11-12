import React, { useState } from "react";
import Button from "../components/ui/Button";
import { uploadImage } from "../api/uploader";
import useProducts from "../hooks/useProducts";

export default function NewProduct() {
  const [product, setProduct] = useState({});
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState();
  const { addProduct } = useProducts();

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
        addProduct.mutate(
          { product, url },
          {
            onSuccess: () => {
              setSuccess("성공적으로 제품이 추가되었습니다.");
              setTimeout(() => {
                setSuccess(null);
              }, 4000);
            },
          }
        );
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

//React Query는 서버의 데이터 가져오기/업데이트, 캐싱, 에러 처리 등을 쉽게 할 수 있도록 돕는 라이브러리
//. 서버에서 가져온 값을 담는 객체, 에러가 발생했을 때 에러 정보를 담는 객체, 데이터 가져오기/엡데이트 중임을 나타내는 등 각종 유틸 기능을 제공합니다. 동일한 요청을 동시에 여러번 해도 한번만 요청을 보내어 최적화 하기 때문에 비동기 작업(API 호출하는 등...)을 좀 더 효율적이고 간단하게 처리할 수 있게 합니다.
//Query는 서버에서 데이터를 가져오는 작업으로 useQuery 훅을 많이 사용합니다. Mutation은 서버의 데이터를 변경하는 부수효과가 있는 작업으로 useMutation 훅을 많이 사용힙니다. 보통은 HTTP 메소드의 GET 요청의 경우 useQuery를 POST, PUT, PATCH, DELETE 요청의 경우 useMutation을 사용하게 됩니다.
//useQueries와 useInfiniteQuery 훅은 useQuery와 동일하게 서버에서 데이터를 가져올 때 사용되는 훅입니다. 여러 데이터를 병렬로 가져와야 할 때는 useQueries 훅을 사용 할 수 있고, 무한 스크롤과 같이 계속해서 데이터를 가져와야 할 경우 useInfiniteQuery 훅을 사용할 수 있습니다
//staleTime은 Query를 통해 가져온 데이터가 오래된 것으로 인식하게 되는 시간입니다. ms 단위로 저장되는데 기본 값은 0입니다. Query는 오래된 데이터라고 판단되면 다시 데이터를 가져옵니다. staleTime에 설정된 시간 따라 Query가 동작 하는 방식은 아래와 같습니다.
//cacheTime은 데이터를 얼마나 오랫동안 보관 할 것인지 나타내는 시간입니다. ms 단위로 저장되는데 기본 값은 5분(5 * 60 * 1000)입니다
//https://beomy.github.io/tech/react/tanstack-query-v4/
