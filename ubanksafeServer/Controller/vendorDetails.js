const mysql = require("../config/db_connection");
const currentUTC = new Date();
const istOffset = 5.5 * 60 * 60 * 1000; 
const istTime = new Date(currentUTC.getTime() + istOffset);
const formattedIST = istTime.toISOString().slice(0, 19).replace('T', ' ');

// 👇Read Api 👇
module.exports.readvenodersdetails  = async (req, res) => {
  // 👇Pagination 👇
  let pagination = (total, page, limit) => {
    let numOfPages = Math.ceil(total / limit);
    let start = page * limit - limit;
    return { limit, start, numOfPages };
  };

  try {
    let {searchVal, date, to, from} = req.body;
    let sql = "select count (*) as Total from tbl_admin";
    let sqlCount =
      "select count (*) as Total FROM tbl_admin WHERE title  LIKE '%" +
      searchVal +
      "%' OR  code  LIKE '%" +
      searchVal +
      "%'";
    let sqlDate = "SELECT count (*) AS Total FROM tbl_admin WHERE Date(created_on) = ?" ;
    let sqlToFrom = "SELECT count (*) AS Total FROM tbl_admin WHERE Date(created_on) >= ? AND Date(created_on) <= ?"
    

    let result = await mysql(searchVal ? sqlCount: date ? sqlDate: to && from ? sqlToFrom  : sql,  date ? [date] : to && from ? [from, to] :"");
    let total = result[0].Total;
    let page = req.body.page ? Number(req.body.page) : 1;
    let limit = req.body.limit ? Number(req.body.limit) : 10;
    let { start, numOfPages } = pagination(total, page, limit);
    

    let sql1 = "SELECT tbl_admin.*, DATE_FORMAT(created_on,'%Y-%m-%d %H:%i:%s') AS created_on, DATE_FORMAT(updated_on,'%Y-%m-%d %H:%i:%s') AS updated_on FROM tbl_admin ORDER BY created_on DESC LIMIT ?,?";
    let sql2 =
      "SELECT tbl_admin.*, DATE_FORMAT(created_on,'%Y-%m-%d %H:%i:%s') AS created_on, DATE_FORMAT(updated_on,'%Y-%m-%d %H:%i:%s') AS updated_on FROM tbl_admin WHERE title  LIKE '%" +
      searchVal +
      "%' OR  code  LIKE '%" +
      searchVal +
      "%'  LIMIT ?,?";
    let sql_Date = "SELECT tbl_admin.*, DATE_FORMAT(created_on,'%Y-%m-%d %H:%i:%s') AS created_on, DATE_FORMAT(updated_on,'%Y-%m-%d %H:%i:%s') AS updated_on FROM tbl_admin WHERE Date(created_on) = ? ORDER BY created_on DESC limit ?,?";
    let sql_tofrom = "SELECT tbl_admin.*, DATE_FORMAT(created_on,'%Y-%m-%d %H:%i:%s') AS created_on, DATE_FORMAT(updated_on,'%Y-%m-%d %H:%i:%s') AS updated_on FROM tbl_admin WHERE Date(created_on) >= ? AND Date(created_on) <= ? ORDER BY created_on DESC limit ?,?"

    let result1 = await mysql(searchVal ? sql2: date? sql_Date: to && from? sql_tofrom : sql1, date? [date, start, limit] : to && from ? [from, to, start, limit]: [start, limit]);

    let startRange = start + 1;
    let endRange = start + result1.length;

    return res.json(200, {
      message: result1.length > 0 ? `Showing ${startRange} to ${endRange} data from ${total}` : "NO DATA",
      currentPage: page,
      totalPages: numOfPages,
      pageLimit: limit,
      data: result1,
    });
  } catch (error) {
    return res.json(500, {
      message: "error occurered",
      error: error,
    });
  }
};
