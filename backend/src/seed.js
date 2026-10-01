const bcrypt=require('bcryptjs');
const pool=require('./db');
(async()=>{
  try{
    await pool.query('DELETE FROM ratings');
    await pool.query('DELETE FROM stores');
    await pool.query('DELETE FROM users');

    const password=async p=>bcrypt.hash(p,10);
    const [a]=await pool.query(
      "INSERT INTO users(name,email,password_hash,address,role) VALUES(?,?,?,?,?)",
      ['System Administrator Demo','admin@example.com',await password('Admin@123'),'Admin Office Address','SYSTEM_ADMIN']);
    const [u1]=await pool.query(
      "INSERT INTO users(name,email,password_hash,address,role) VALUES(?,?,?,?,?)",
      ['Normal User Demo Account','user@example.com',await password('User@123'),'User Residential Address','NORMAL_USER']);
    const [o]=await pool.query(
      "INSERT INTO users(name,email,password_hash,address,role) VALUES(?,?,?,?,?)",
      ['Store Owner Demo Account','owner@example.com',await password('Owner@123'),'Owner Business Address','STORE_OWNER']);
    const [s]=await pool.query(
      "INSERT INTO stores(name,email,address,owner_id) VALUES(?,?,?,?)",
      ['Demo Store Twenty Characters','store@example.com','Demo Store Address',o.insertId]);
    await pool.query('INSERT INTO ratings(store_id,user_id,rating) VALUES(?,?,?)',[s.insertId,u1.insertId,5]);
    console.log('Seed complete');
    console.log('Admin: admin@example.com / Admin@123');
    console.log('User: user@example.com / User@123');
    console.log('Owner: owner@example.com / Owner@123');
  }catch(e){console.error(e)}finally{pool.end();}
})();
