import axios from 'axios';
export const api=axios.create({baseURL:'http://localhost:5000/api'});
api.interceptors.request.use(c=>{const t=localStorage.getItem('token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
export const saveSession=(data)=>{localStorage.setItem('token',data.token);localStorage.setItem('user',JSON.stringify(data.user))};
export const user=()=>JSON.parse(localStorage.getItem('user')||'null');
export const logout=()=>{localStorage.removeItem('token');localStorage.removeItem('user')};
