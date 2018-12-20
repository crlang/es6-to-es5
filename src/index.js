// import jQuery from "./src/jquery-3.3.1.min.js";

import $ from 'expose-loader?$!./jquery-3.3.1.min.js';


import "./a.css";
import "./b.css";

import "./public.js";

Vue.config.productionTip = true;

const a = 6;
console.log(a);
if(a === 6) {
  const arr = [];
}
const arr = [{
  name: "张三",
  sex: "man"
},{
  name: "李四",
  sex: "woman"
}]
let newArr = arr.filter(k => k.sex === 'woman');
console.log(newArr);
