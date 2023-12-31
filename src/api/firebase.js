import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";
import { getDatabase, ref, set, get, remove } from "firebase/database";
import {v4 as uuid} from "uuid";
 
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
//로그아웃후 로그인시 자동 로그인 안되게 하는 설정은 아래와 같다.
provider.setCustomParameters({

  prompt: 'select_account',

});
const auth = getAuth();
const database = getDatabase(app);

export function login() {
  signInWithPopup(auth, provider).catch(console.error);
}

export function logout() {
  signOut(auth).catch(console.error);
}

//사용자 상태 변경 함수
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}

//어드민인지 확인후 isAdmin을 넣어 반환해 주는 내부 함수
async function adminUser(user) {
  return get(ref(database, 'admins'))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const admins = snapshot.val();
      const isAdmin = admins.includes(user.uid);
      return {...user, isAdmin};
    }
    return user;
  });
  
}

//새로운 제품 등록
export async function addNewProduct(product, image) {
  const id = uuid();
  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image,
    options: product.options.split(',')
  })
}

//제품 정보 가져오기
export async function getProducts() {
  return get(ref(database, 'products')).then(snapshot => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } 
    return [];
  })
}

//장바구니 내용 가져오기
export async function getCart(userId) {
  return get(ref(database, `carts/${userId}`))
  .then((snapshot) => {
    const items = snapshot.val() || {};
    return Object.values(items);
  });
}

//장바구니에 추가 또는 수정
export async function addOrUpdateToCart(userId, product) {
  return set(ref(database, `carts/${userId}/${product.id}`), product);
}

//장바구니 삭제
export async function removeFromCart(userId, productId) {
  return remove(ref(database, `carts/${userId}/${productId}`));
}