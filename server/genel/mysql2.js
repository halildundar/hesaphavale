// backend/db-rx.js
import mysql from "mysql2/promise";
import { from } from "rxjs";

export class DatabaseRx {
  constructor(config) {
    this.pool = mysql.createPool(config);
  }
  query(sql, params = []) {
    return from(this.pool.execute(sql, params).then(([rows]) => rows));
  }
  create(table, data) {
    const keys = Object.keys(data).join(",");
    const values = Object.values(data);
    const placeholders = values.map(() => "?").join(",");
    const sql = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;
    return from(
      this.pool.execute(sql, values).then(([result]) => result.insertId)
    );
  }
  readTartiAletMarka(table, srchtxt) {
    let sql = `SELECT id,marka FROM ${table} WHERE marka LIKE '%${srchtxt}%' ORDER BY marka ASC`;
    console.log(sql);
    return this.query(sql);
  }

  read(table, where = {}, like = {}, order = {}, limit, offset) {
    let sql = `SELECT * FROM ${table}`;
    let values = [];
    if (Object.keys(where).length) {
      const conditions = Object.keys(where)
        .map((k) => `${k}=?`)
        .join(" AND ");
      sql += ` WHERE ${conditions}`;
      values = Object.values(where);
      // console.log(where, values);
    }
    if (Object.keys(like).length) {
      const conditions = Object.keys(like)
        .map((k) => `${k} LIKE '%${like[k]}%'`)
        .join(` OR `);
      sql += ` ${Object.keys(where).length ? "AND" : "WHERE "} (${conditions})`;
      // values = Object.values(where);
    }
    if (Object.keys(order).length) {
      const columns = Object.keys(order)
        .map((k) => `${k}`)
        .join(" , ");
      const results = Object.values(order);
      sql += ` ORDER BY ${columns} ${results} `;
    }
    if (!!limit) {
      sql += ` LIMIT ${limit}`;
    }
    if (offset >= 0) {
      sql += ` OFFSET ${offset}`;
    }

    // console.log(sql, values);
    return this.query(sql, values);
  }

  update(table, data, where) {
    const setStr = Object.keys(data)
      .map((k) => `${k}=?`)
      .join(", ");
    const setValues = Object.values(data);
    const whereStr = Object.keys(where)
      .map((k) => `${k}=?`)
      .join(" AND ");
    const whereValues = Object.values(where);
    const sql = `UPDATE ${table} SET ${setStr} WHERE ${whereStr}`;
    console.log("sql ıpdate:", sql);
    console.log("setvalues:", setValues);
    console.log("whereValues:", whereValues);
    return this.query(sql, [...setValues, ...whereValues]);
  }

  delete(table, where) {
    const whereStr = Object.keys(where)
      .map((k) => `${k}=?`)
      .join(" AND ");
    const whereValues = Object.values(where);
    const sql = `DELETE FROM ${table} WHERE ${whereStr}`;
    return this.query(sql, whereValues);
  }

  ImportTartiKullanici(data) {
    let yms_firma_id = 17;
    
    let values = data.map(item => [null,yms_firma_id,item.ad_soyad, item.kisa_ad, item.unvan,item.email,item.gercek_tuzel,item.il,item.ilce,item.mahalle,item.pk,item.adres,item.status,item.telefon,item.vergi_no,item.tc,item.kayit_tarih]);
    const sql = "INSERT INTO tartikullanici (id,yms_firma_id,ad_soyad,kisa_ad,unvan,email,gercek_tuzel,il,ilce,mahalle,pk,adres,status,telefon,vergi_no,tc,kayit_tarih) VALUES ?";
    console.log(sql);
    console.log(values);
    // return {
    //   sql,
    //   values
    // };
    return from(
      this.pool.query(sql, [values]).then(([result]) => result.insertId)
    )
  }
}
